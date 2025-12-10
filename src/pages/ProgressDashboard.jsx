import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function ProgressDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchAssessmentHistory();
  }, [user, navigate]);

  const fetchAssessmentHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/endoguard/history', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assessment history');
      }

      const data = await response.json();
      setAssessments(data.assessments || []);
      setStats(data.stats || {});
    } catch (err) {
      console.error('Error fetching assessment history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartData = assessments
    .slice()
    .reverse() // Show oldest to newest
    .map((assessment, index) => ({
      date: new Date(assessment.completed_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      riskScore: assessment.overall_risk_score || 0,
      edcScore: assessment.edc_risk_score || 0,
      symptoms: assessment.symptom_count || 0,
      bmi: assessment.bmi ? parseFloat(assessment.bmi) : null,
      index: index + 1
    }));

  // Get trend indicator
  const getTrendIcon = (trend) => {
    if (trend === 'improving') return '📈';
    if (trend === 'worsening') return '📉';
    return '➡️';
  };

  const getTrendColor = (trend) => {
    if (trend === 'improving') return 'text-green-600';
    if (trend === 'worsening') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendText = (trend) => {
    if (trend === 'improving') return t('progress.improving', 'Improving');
    if (trend === 'worsening') return t('progress.worsening', 'Worsening');
    return t('progress.stable', 'Stable');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">
          {t('common.loading', 'Loading...')}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">
          {t('common.error', 'Error')}: {error}
        </div>
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              {t('progress.noData', 'No Assessment History')}
            </h1>
            <p className="text-slate-600 mb-6">
              {t('progress.noDataDesc', 'Complete your first EndoGuard assessment to start tracking your progress.')}
            </p>
            <button
              onClick={() => navigate('/endoguard')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              {t('progress.startAssessment', 'Start Assessment')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-cyan-400 hover:text-cyan-300 mb-4 flex items-center gap-2"
          >
            ← {t('common.back', 'Back to Dashboard')}
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('progress.title', 'Progress Dashboard')}
          </h1>
          <p className="text-slate-300">
            {t('progress.subtitle', 'Track your hormone health journey over time')}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-sm text-slate-600 mb-1">
              {t('progress.totalAssessments', 'Total Assessments')}
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {stats.totalAssessments}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-sm text-slate-600 mb-1">
              {t('progress.averageRisk', 'Average Risk Score')}
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {stats.averageRiskScore}
              <span className="text-lg text-slate-600">/100</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-sm text-slate-600 mb-1">
              {t('progress.latestBMI', 'Latest BMI')}
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {stats.latestBMI ? parseFloat(stats.latestBMI).toFixed(1) : 'N/A'}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-sm text-slate-600 mb-1">
              {t('progress.trend', 'Trend')}
            </div>
            <div className={`text-3xl font-bold ${getTrendColor(stats.riskTrend)}`}>
              {getTrendIcon(stats.riskTrend)} {getTrendText(stats.riskTrend)}
            </div>
          </div>
        </div>

        {/* Risk Score Trend Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {t('progress.riskTrend', 'Risk Score Trend')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEDC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="riskScore"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorRisk)"
                name={t('progress.overallRisk', 'Overall Risk')}
              />
              <Area
                type="monotone"
                dataKey="edcScore"
                stroke="#ec4899"
                fillOpacity={1}
                fill="url(#colorEDC)"
                name={t('progress.edcRisk', 'EDC Risk')}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* BMI Trend Chart */}
        {chartData.some(d => d.bmi !== null) && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('progress.bmiTrend', 'BMI Trend')}
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[15, 35]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bmi"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  name={t('progress.bmi', 'BMI')}
                />
                {/* Healthy range reference lines */}
                <Line
                  type="monotone"
                  data={[{ date: chartData[0]?.date, value: 18.5 }, { date: chartData[chartData.length - 1]?.date, value: 18.5 }]}
                  dataKey="value"
                  stroke="#10b981"
                  strokeDasharray="5 5"
                  dot={false}
                  name={t('progress.healthyMin', 'Healthy Min')}
                />
                <Line
                  type="monotone"
                  data={[{ date: chartData[0]?.date, value: 25 }, { date: chartData[chartData.length - 1]?.date, value: 25 }]}
                  dataKey="value"
                  stroke="#10b981"
                  strokeDasharray="5 5"
                  dot={false}
                  name={t('progress.healthyMax', 'Healthy Max')}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Symptom Count Trend */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {t('progress.symptomTrend', 'Symptom Count Trend')}
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="symptoms"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 6 }}
                name={t('progress.symptoms', 'Symptoms')}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Assessment Timeline */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {t('progress.timeline', 'Assessment Timeline')}
          </h2>
          <div className="space-y-4">
            {assessments.map((assessment, index) => (
              <div
                key={assessment.id}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {assessments.length - index}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-lg font-semibold text-slate-900">
                      {new Date(assessment.completed_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      assessment.overall_risk_level === 'HIGH' ? 'bg-red-100 text-red-700' :
                      assessment.overall_risk_level === 'MODERATE' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {assessment.overall_risk_level}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                    <div>
                      <span className="font-medium">{t('progress.riskScore', 'Risk Score')}:</span> {assessment.overall_risk_score}/100
                    </div>
                    <div>
                      <span className="font-medium">{t('progress.symptoms', 'Symptoms')}:</span> {assessment.symptom_count}
                    </div>
                    <div>
                      <span className="font-medium">{t('progress.edcScore', 'EDC Score')}:</span> {assessment.edc_risk_score}/100
                    </div>
                    {assessment.bmi && (
                      <div>
                        <span className="font-medium">{t('progress.bmi', 'BMI')}:</span> {parseFloat(assessment.bmi).toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/endoguard')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            {t('progress.takeNewAssessment', 'Take New Assessment')}
          </button>
        </div>
      </div>
    </div>
  );
}
