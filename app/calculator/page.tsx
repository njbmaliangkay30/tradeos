'use client'; 

import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, AlertTriangle, ShieldCheck, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const INITIAL_CAPITAL = 1000;

export default function CalculatorPage() {
  const [pair, setPair] = useState('BTC/USDT');
  const [capital, setCapital] = useState<number | ''>('Loading...'); // Akan diisi otomatis
  const [riskPercent, setRiskPercent] = useState<number | ''>(1);
  const [entryPrice, setEntryPrice] = useState<number | ''>('');
  const [stopLoss, setStopLoss] = useState<number | ''>('');

  const [isLogging, setIsLogging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  // AUTO-FETCH REAL BALANCE
  useEffect(() => {
    const fetchRealBalance = async () => {
      const { data } = await supabase.from('trades').select('status, pnl');
      if (data) {
        const closedTrades = data.filter(t => t.status !== 'OPEN');
        const netProfit = closedTrades.reduce((sum, trade) => sum + Number(trade.pnl || 0), 0);
        setCapital(INITIAL_CAPITAL + netProfit); // Set modal sesuai balance asli
      } else {
        setCapital(INITIAL_CAPITAL);
      }
    };
    fetchRealBalance();
  }, []);

  // Perhitungan hanya berjalan jika capital berupa angka
  const currentCap = typeof capital === 'number' ? capital : 0;
  const riskAmount = currentCap * (Number(riskPercent) / 100);
  const priceDifference = Math.abs(Number(entryPrice) - Number(stopLoss));
  const stopLossPercent = Number(entryPrice) > 0 ? (priceDifference / Number(entryPrice)) * 100 : 0;
  const positionSize = priceDifference > 0 ? riskAmount / priceDifference : 0;
  const totalPositionValue = positionSize * Number(entryPrice);
  const isLong = Number(entryPrice) > Number(stopLoss);

  // Fungsi Log Trade (Sama seperti sebelumnya)
  const handleLogTrade = async () => {
    if (!entryPrice || !stopLoss || !pair || currentCap === 0) return;
    setIsLogging(true);
    setIsError(false);
    try {
      const { error } = await supabase.from('trades').insert([{
          pair: pair.toUpperCase(),
          direction: isLong ? 'LONG' : 'SHORT',
          entry_price: Number(entryPrice),
          stop_loss: Number(stopLoss),
          risk_amount: riskAmount,
          position_size: positionSize,
          status: 'OPEN'
        }]);
      if (error) throw error;
      setIsLogging(false);
      setIsSuccess(true);
      setEntryPrice(''); // Kosongkan form agar siap trade lagi
      setStopLoss('');
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setIsLogging(false);
      setIsError(true);
      setTimeout(() => setIsError(false), 3000);
    }
  };

  //... (LANJUTAN KODE UI DI BAWAH INI SAMA PERSIS SEPERTI SEBELUMNYA)
  //... Tapi pastikan input Total Capital menjadi "Read-Only" (Disable) agar user tak curang mengubah modal sembarangan.
