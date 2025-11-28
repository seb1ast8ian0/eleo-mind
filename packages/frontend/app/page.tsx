import { promises as fs } from 'fs';
import path from 'path';
import { KPICards } from '@/components/dashboard/KPICards';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { AlertSection } from '@/components/dashboard/AlertSection';
import { ArticleTable } from '@/components/dashboard/ArticleTable';
import Image from 'next/image';

async function getData() {
  const dataDir = path.join(process.cwd(), 'public/data');
  
  const forecastData = JSON.parse(await fs.readFile(path.join(dataDir, 'mock_general_forecast.json'), 'utf8'));
  const alertsData = JSON.parse(await fs.readFile(path.join(dataDir, 'mock_alerts.json'), 'utf8'));
  const articlesData = JSON.parse(await fs.readFile(path.join(dataDir, 'mock_articles.json'), 'utf8'));

  return {
    forecast: forecastData,
    alerts: alertsData,
    articles: articlesData,
  };
}

export default async function Home() {
  const { forecast, alerts, articles } = await getData();

  // Calculate KPI data
  const criticalArticlesCount = alerts.length; // Assuming all in alerts are critical or near critical
  const forecastChangePercent = Math.round(((forecast.sales_forecast - forecast.sales_last_month) / forecast.sales_last_month) * 100);

  return (
    <div className="space-y-6">
          
          <header className="md:hidden flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 relative">
                  <Image 
                    src="/eleo_logo.png" 
                    alt="ELEO Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold text-[#1f1c17]">ELEO Mind</h1>
             </div>
          </header>

          {/* Top Section: KPIs (Dark Card) and Trend Chart (Light Card) */}
          <div className="grid gap-6 md:grid-cols-12">
            {/* KPIs - Takes up 4 columns */}
            <div className="md:col-span-4 lg:col-span-4">
               <KPICards 
                 criticalArticlesCount={criticalArticlesCount} 
                 forecastChangePercent={forecastChangePercent} 
               />
            </div>
            
            {/* Trend Chart - Takes up 8 columns */}
            <div className="md:col-span-8 lg:col-span-8">
              <TrendChart 
                history={forecast.history} 
                forecast={forecast.forecast} 
              />
            </div>
          </div>

          {/* Middle Section: Alerts (Engagement Style) */}
          <section>
            <AlertSection alerts={alerts} />
          </section>

          {/* Bottom Section: Article Table */}
          <section>
            <ArticleTable articles={articles} />
          </section>
    </div>
  );
}
