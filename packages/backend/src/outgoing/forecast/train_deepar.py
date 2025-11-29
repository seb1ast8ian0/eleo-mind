import pandas as pd

from pytorch_forecasting import TimeSeriesDataSet
from pytorch_forecasting.data import NaNLabelEncoder
from pytorch_forecasting.data.encoders import TorchNormalizer

import lightning.pytorch as pl
from pytorch_forecasting import DeepAR
from pytorch_forecasting.metrics.distributions import NegativeBinomialDistributionLoss

import torch
torch.set_float32_matmul_precision('medium')


future_df = pd.read_csv("future_features_dataset.csv")
train_df = pd.read_csv("forecast_dataset.csv")

future_df["date"] = pd.to_datetime(future_df["date"])
train_df["date"] = pd.to_datetime(train_df["date"])

train_df = train_df.sort_values(["SKU", "date"])

train_df["time_idx"] = (train_df["date"] - train_df["date"].min()).dt.days.astype("int64")

train_df["SKU"] = train_df["SKU"].astype("category")

# make calendar features string-based, then categorical
train_df["month"] = train_df["month"].astype(str).astype("category")
train_df["day_of_week"] = train_df["day_of_week"].astype(str).astype("category")

# bool is treated as numeric -> convert to string labels
train_df["is_holiday"] = train_df["is_holiday"].map(
    {True: "holiday", False: "no_holiday"}
).astype("category")


max_prediction_length = 100
max_encoder_length = 365
min_encoder_length = 90
min_prediction_length = 30

# compute training cutoff so that we leave exactly 100 days for validation
training_cutoff = train_df["time_idx"].max() - max_prediction_length

# -----------------------------
# Training dataset
# -----------------------------
deep_ar_train = TimeSeriesDataSet(
    train_df[lambda x: x.time_idx <= training_cutoff],
    time_idx="time_idx",
    target="qty",
    group_ids=["SKU"],
    static_categoricals=["SKU"],
    time_varying_known_reals=["price_per_unit", "tavg", "prcp", "tsun", "sale_percent"],
    time_varying_known_categoricals=["month", "day_of_week", "is_holiday"],
    time_varying_unknown_reals=["qty"],
    max_prediction_length=max_prediction_length,
    max_encoder_length=max_encoder_length,
    min_encoder_length=min_encoder_length,
    min_prediction_length=min_prediction_length,
    target_normalizer=TorchNormalizer(method="identity", center=False),
)

# -----------------------------
# Validation dataset
# -----------------------------
deep_ar_val = TimeSeriesDataSet.from_dataset(
    deep_ar_train,
    train_df,
    min_prediction_idx=training_cutoff + 1,  # first decoder step of validation
    stop_randomization=True,
)

train_dataloader = deep_ar_train.to_dataloader(
    train=True, batch_size=64, num_workers=8
)
val_dataloader = deep_ar_val.to_dataloader(
    train=False, batch_size=64, num_workers=8
)

# -----------------------------
# 5) Trainer + model
# -----------------------------
from lightning.pytorch.callbacks import ModelCheckpoint

checkpoint_callback = ModelCheckpoint(
    dirpath="checkpoints",        # folder where to save
    filename="deepar-best",       # base filename (no .ckpt)
    save_top_k=1,                 # only keep best model
    monitor="val_loss",           # metric to monitor
    mode="min",
)

trainer = pl.Trainer(
    max_epochs=20,
    accelerator="auto",
    gradient_clip_val=0.1,
    callbacks=[checkpoint_callback],
)

model = DeepAR.from_dataset(
    deep_ar_train,  # your training TimeSeriesDataSet
    learning_rate=1e-3,
    hidden_size=64,
    rnn_layers=2,
    loss=NegativeBinomialDistributionLoss(),
)

trainer.fit(
    model,
    train_dataloaders=train_dataloader,
    val_dataloaders=val_dataloader,
)

# path to the best model (e.g. "checkpoints/deepar-best.ckpt")
best_model_path = checkpoint_callback.best_model_path
print("Best model saved at:", best_model_path)