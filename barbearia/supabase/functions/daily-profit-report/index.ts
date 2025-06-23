import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const today = new Date().toISOString().split('T')[0]
    const isWeekend = new Date().getDay() === 6 // Saturday
    const isEndOfMonth = new Date().getDate() === new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()

    // Get daily profits
    const { data: dailyData, error: dailyError } = await supabaseClient
      .rpc('calculate_daily_profits', { target_date: today })

    if (dailyError) throw dailyError

    let message = `*📊 RELATÓRIO DIÁRIO - ${new Date().toLocaleDateString('pt-BR')}*\n\n`
    
    if (dailyData && dailyData.length > 0) {
      const daily = dailyData[0]
      message += `💰 *Faturamento:* R$ ${daily.total_revenue?.toFixed(2) || '0.00'}\n`
      message += `💵 *Lucro:* R$ ${daily.total_profit?.toFixed(2) || '0.00'}\n`
      message += `✂️ *Total de Serviços:* ${daily.total_services || 0}\n\n`
      
      if (daily.services_breakdown && Array.isArray(daily.services_breakdown)) {
        message += `*📋 Detalhamento:*\n`
        daily.services_breakdown.forEach((service: any) => {
          message += `• ${service.service}: ${service.count}x - R$ ${service.profit?.toFixed(2)}\n`
        })
        message += `\n`
      }
    } else {
      message += `Nenhum serviço realizado hoje.\n\n`
    }

    // Add weekly report on Saturdays
    if (isWeekend) {
      const { data: weeklyData, error: weeklyError } = await supabaseClient
        .rpc('calculate_weekly_profits', { target_date: today })

      if (!weeklyError && weeklyData && weeklyData.length > 0) {
        const weekly = weeklyData[0]
        message += `*📅 RELATÓRIO SEMANAL*\n`
        message += `💰 *Faturamento Semanal:* R$ ${weekly.total_revenue?.toFixed(2) || '0.00'}\n`
        message += `💵 *Lucro Semanal:* R$ ${weekly.total_profit?.toFixed(2) || '0.00'}\n`
        message += `✂️ *Serviços da Semana:* ${weekly.total_services || 0}\n\n`
      }
    }

    // Add monthly report on last day of month
    if (isEndOfMonth) {
      const { data: monthlyData, error: monthlyError } = await supabaseClient
        .rpc('calculate_monthly_profits', { target_date: today })

      if (!monthlyError && monthlyData && monthlyData.length > 0) {
        const monthly = monthlyData[0]
        message += `*📊 RELATÓRIO MENSAL*\n`
        message += `💰 *Faturamento Mensal:* R$ ${monthly.total_revenue?.toFixed(2) || '0.00'}\n`
        message += `💵 *Lucro Mensal:* R$ ${monthly.total_profit?.toFixed(2) || '0.00'}\n`
        message += `✂️ *Serviços do Mês:* ${monthly.total_services || 0}\n\n`
      }
    }

    message += `_Relatório gerado automaticamente às ${new Date().toLocaleTimeString('pt-BR')}_`

    // Send to WhatsApp (você precisará configurar a API do WhatsApp)
    const whatsappUrl = `https://wa.me/5585994066861?text=${encodeURIComponent(message)}`
    
    // For now, we'll return the message and URL
    // In production, you would integrate with WhatsApp Business API
    console.log('Sending WhatsApp message:', message)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Report generated successfully',
        whatsappUrl,
        reportData: message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
