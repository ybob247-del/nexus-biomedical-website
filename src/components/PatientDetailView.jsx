import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, TrendingUp, TrendingDown, Activity,
  FileText, AlertCircle, CheckCircle, User, Mail, Clock
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PatientDetailView = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/provider/patient-assessments?patientId=${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch patient data');
      }

      const data = await response.json();
      setPatientData(data);
      if (data.assessments && data.assessments.length > 0) {
        setSelectedAssessment(data.assessments[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (score) => {
    if (score >= 70) return 'bg-red-100 text-red-800 border-red-300';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  const getRiskCategory = (score) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Moderate Risk';
    return 'Low Risk';
  };

  const getTrendIcon = (trend) => {
    if (!trend) return null;
    if (trend.change > 0) return <TrendingUp className="w-5 h-5 text-red-500" />;
    if (trend.change < 0) return <TrendingDown className="w-5 h-5 text-green-500" />;
    return <Activity className="w-5 h-5 text-gray-500" />;
  };

  // Prepare chart data
  const getChartData = () => {
    if (!patientData?.assessments || patientData.assessments.length === 0) {
      return null;
    }

    const sortedAssessments = [...patientData.assessments].reverse(); // Oldest to newest
    
    return {
      labels: sortedAssessments.map(a => new Date(a.created_at).toLocaleDateString()),
      datasets: [
        {
          label: 'Risk Score',
          data: sortedAssessments.map(a => a.risk_score),
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'BMI',
          data: sortedAssessments.map(a => a.bmi),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Patient Progress Over Time'
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Risk Score'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'BMI'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Error</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={() => navigate('/provider/dashboard')}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/provider/dashboard')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Patient List
          </button>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {patientData?.patient.first_name} {patientData?.patient.last_name}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Mail className="w-4 h-4" />
                    <span>{patientData?.patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>Patient since {new Date(patientData?.patient.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {patientData?.summary.latest_assessment && (
                <div className="text-right">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getRiskBadgeColor(patientData.summary.latest_assessment.risk_score)}`}>
                    {getRiskCategory(patientData.summary.latest_assessment.risk_score)}
                  </span>
                  <p className="text-sm text-gray-600 mt-2">
                    Score: {patientData.summary.latest_assessment.risk_score}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Assessments</p>
                <p className="text-3xl font-bold text-gray-900">{patientData?.summary.total_assessments || 0}</p>
              </div>
              <FileText className="w-10 h-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Latest Risk Score</p>
                <p className="text-3xl font-bold text-gray-900">
                  {patientData?.summary.latest_assessment?.risk_score || 'N/A'}
                </p>
              </div>
              <Activity className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Risk Trend</p>
                <div className="flex items-center gap-2">
                  {patientData?.summary.risk_trend ? (
                    <>
                      {getTrendIcon(patientData.summary.risk_trend)}
                      <p className="text-3xl font-bold text-gray-900">
                        {Math.abs(patientData.summary.risk_trend.change).toFixed(1)}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500">No trend data</p>
                  )}
                </div>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500" />
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        {getChartData() && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Progress Timeline</h2>
            <Line data={getChartData()} options={chartOptions} />
          </div>
        )}

        {/* Assessment History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment History</h2>
          
          {patientData?.assessments && patientData.assessments.length > 0 ? (
            <div className="space-y-4">
              {patientData.assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  onClick={() => setSelectedAssessment(assessment)}
                  className={`border rounded-lg p-6 cursor-pointer transition-all ${
                    selectedAssessment?.id === assessment.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span className="text-lg font-semibold text-gray-900">
                          {new Date(assessment.created_at).toLocaleDateString()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(assessment.risk_score)}`}>
                          {getRiskCategory(assessment.risk_score)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Risk Score:</span>
                          <span className="font-medium text-gray-900 ml-2">{assessment.risk_score}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">BMI:</span>
                          <span className="font-medium text-gray-900 ml-2">{assessment.bmi?.toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Age:</span>
                          <span className="font-medium text-gray-900 ml-2">{assessment.age}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Weight:</span>
                          <span className="font-medium text-gray-900 ml-2">{assessment.weight} lbs</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedAssessment?.id === assessment.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">Detailed Assessment</h3>
                      
                      {/* Symptoms */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-700 mb-2">Reported Symptoms</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {assessment.hot_flashes && (
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Hot Flashes: {assessment.hot_flashes}</span>
                            </div>
                          )}
                          {assessment.night_sweats && (
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Night Sweats: {assessment.night_sweats}</span>
                            </div>
                          )}
                          {assessment.mood_changes && (
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Mood Changes: {assessment.mood_changes}</span>
                            </div>
                          )}
                          {assessment.sleep_issues && (
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Sleep Issues: {assessment.sleep_issues}</span>
                            </div>
                          )}
                          {assessment.energy_levels && (
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Energy: {assessment.energy_levels}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* AI Insights */}
                      {assessment.ai_insights && (
                        <div className="bg-purple-50 rounded-lg p-4 mb-4">
                          <h4 className="font-medium text-purple-900 mb-2">AI Analysis</h4>
                          <p className="text-sm text-purple-800">
                            {assessment.ai_insights.clinical_reasoning || 'No AI insights available'}
                          </p>
                        </div>
                      )}

                      {/* Recommendations */}
                      {assessment.recommendations && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-2">Recommendations</h4>
                          <div className="text-sm text-blue-800 space-y-1">
                            {Array.isArray(assessment.recommendations) ? (
                              assessment.recommendations.map((rec, idx) => (
                                <p key={idx}>• {rec}</p>
                              ))
                            ) : (
                              <p>{assessment.recommendations}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No assessments found for this patient</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetailView;
