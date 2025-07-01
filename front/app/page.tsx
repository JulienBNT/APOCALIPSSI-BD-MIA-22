'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  Brain, 
  Download,
  CheckCircle,
  Clock,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Star
} from 'lucide-react';

interface PDFFile {
  name: string;
  size: number;
  type: string;
}

interface Summary {
  title: string;
  fullSummary: string;
  confidence: number;
  raw: string;
}


type AppState = 'upload' | 'processing' | 'completed';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [uploadedFile, setUploadedFile] = useState<PDFFile | null>(null);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (file.type === 'application/pdf') {
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type
      });
      setAppState('processing');
      setProgress(0);
      // Préparation de l'envoi du fichier au back
      const formData = new FormData();
      formData.append('file', file);
      try {
        // Simule la progression
        let progressValue = 0;
        const progressInterval = setInterval(() => {
          progressValue += Math.random() * 15;
          setProgress(Math.min(progressValue, 95));
        }, 200);
        const response = await fetch('http://localhost:5001/api/upload', {
          method: 'POST',
          body: formData
        });
        clearInterval(progressInterval);
        setProgress(100);
        if (!response.ok) throw new Error('Erreur lors de la génération du résumé');
        const data = await response.json();
        setSummary({
          title: 'Résumé automatique',
          fullSummary: typeof data.summary === 'string' ? data.summary : data.summary.summary,
          confidence: 100,
          raw: JSON.stringify(data.raw_output ?? '')
        });

        setAppState('completed');
      } catch (error) {
        setAppState('upload');
        setUploadedFile(null);
        setProgress(0);
        alert('Erreur lors de l\'analyse du document. Veuillez réessayer.');
      }
    }
  };

  const startProcessing = () => {
    setAppState('processing');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setSummary({
              title: "Analyse de Document Technique",
              fullSummary: `Introduction aux concepts fondamentaux de l'intelligence artificielle. Méthodologies d'apprentissage automatique et réseaux de neurones. Applications pratiques dans l'industrie moderne. Défis éthiques et considérations futures.

            L'IA transforme radicalement les processus industriels. L'importance de l'éthique dans le développement technologique. Les réseaux de neurones offrent des solutions innovantes.

            Ce document présente une vue d'ensemble complète de l'état actuel de l'IA et de ses perspectives d'avenir, soulignant l'importance d'une approche équilibrée entre innovation et responsabilité.`,
              confidence: 94,
              raw: "Raw output data for debugging purposes"
            });
            setAppState('completed');
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const resetApp = () => {
    setAppState('upload');
    setUploadedFile(null);
    setProgress(0);
    setSummary(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5 pointer-events-none"></div>
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg glow-blue-subtle">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white text-display">ComplySummarize IA</h1>
            <p className="text-blue-300/80 font-medium">Résumé automatique par IA</p>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-2 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16">
        {appState === 'upload' && (
          <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-5xl font-light text-white text-display gradient-text">
                  Analysez vos documents PDF
                </h2>
                <p className="text-base sm:text-xl text-zinc-400 text-body max-w-2xl mx-auto">
                  Obtenez un résumé intelligent et des insights clés en quelques secondes grâce à notre IA avancée
                </p>
              </div>
            </div>
            {/* Upload Section */}
            <Card className="border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm card-hover w-full">
              <CardContent className="p-4 sm:p-8 md:p-12 w-full">
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-12 md:p-20 text-center transition-all duration-500 ${
                    isDragOver
                      ? 'border-blue-400 bg-blue-500/10 glow-blue scale-[1.02]'
                      : 'border-zinc-700/50 hover:border-blue-500/50 hover:bg-blue-500/5'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-8">
                    <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center border border-blue-500/20">
                      <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-lg sm:text-2xl font-medium text-white text-display">
                        Glissez votre PDF ici
                      </h3>
                      <p className="text-zinc-400 text-base sm:text-lg text-body">
                        ou cliquez pour sélectionner un fichier
                      </p>
                    </div>
                    <Button
                      onClick={() => document.getElementById('file-input')?.click()}
                      className="apple-button text-white px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-xl"
                    >
                      <FileText className="w-5 h-5 mr-3" />
                      Sélectionner un fichier
                    </Button>
                    <input
                      id="file-input"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    />
                    <p className="text-xs sm:text-sm text-zinc-500">
                      Formats acceptés: PDF • Taille max: 10MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Features */}
            <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3">
              {[
                {
                  icon: Zap,
                  title: "Traitement Ultra-Rapide",
                  description: "Analyse complète en moins de 30 secondes",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Brain,
                  title: "IA de Pointe",
                  description: "Modèles d'apprentissage profond avancés",
                  color: "from-purple-500 to-blue-500"
                },
                {
                  icon: Shield,
                  title: "Sécurisé & Privé",
                  description: "Vos documents restent confidentiels",
                  color: "from-emerald-500 to-blue-500"
                }
              ].map((feature, index) => (
                <Card key={index} className="border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm card-hover group w-full">
                  <CardContent className="p-8 text-center">
                    <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-3 text-display">{feature.title}</h4>
                    <p className="text-zinc-400 text-body leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {appState === 'processing' && (
          <div className="space-y-8">
            <Card className="border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm">
              <CardContent className="p-16">
                <div className="text-center space-y-10">
                  <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center pulse-glow">
                    <RefreshCw className="w-12 h-12 text-white animate-spin" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-3xl font-light text-white text-display">
                      Analyse en cours
                    </h3>
                    <p className="text-xl text-blue-300/80 text-body">
                      Notre IA traite votre document avec précision
                    </p>
                  </div>

                  {uploadedFile && (
                    <div className="flex items-center justify-center gap-4 text-zinc-300">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span className="font-medium">{uploadedFile.name}</span>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {formatFileSize(uploadedFile.size)}
                      </Badge>
                    </div>
                  )}

                  <div className="space-y-6 max-w-md mx-auto">
                    <Progress 
                      value={progress} 
                      className="h-3 bg-zinc-800 rounded-full overflow-hidden"
                    />
                    <p className="text-blue-300/60 text-lg font-medium">
                      {Math.round(progress)}% terminé
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {appState === 'completed' && summary && (
          <div className="space-y-8">
            {/* Header */}
            <Card className="border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm w-full">
              <CardContent className="p-4 sm:p-6 md:p-8 w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white text-display">Analyse terminée</h3>
                      <p className="text-zinc-400 text-body text-sm sm:text-base">{uploadedFile?.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <Badge className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 border-blue-500/30 px-4 py-2">
                      <Star className="w-4 h-4 mr-2" />
                      {summary.confidence}% de confiance
                    </Badge>
                    <Button
                      onClick={resetApp}
                      variant="outline"
                      className="border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/50 hover:border-blue-500/50 w-full sm:w-auto"
                    >
                      Nouveau document
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Summary Content */}
            <div className="space-y-8">
              {/* Title */}
              <Card className="border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm card-hover w-full">
                <CardContent className="p-4 sm:p-6 md:p-10 w-full">
                  <h2 className="text-2xl sm:text-3xl font-light text-white mb-4 text-display">{summary.title}</h2>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-body text-sm sm:text-base">Analysé maintenant</span>
                  </div>
                </CardContent>
              </Card>
              {/* Main Points */}
              <Card className="border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm card-hover w-full">
                <CardContent className="p-4 sm:p-6 md:p-10 w-full">
                  <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <FileText className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl sm:text-2xl font-semibold text-white text-display">Résumé complet</h3>
                  </div>
                  <p className="text-zinc-200 text-base sm:text-lg text-body leading-relaxed whitespace-pre-line">
                    {summary.fullSummary}
                  </p>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Button
                  className="apple-button text-white flex-1 py-4 sm:py-6 text-base sm:text-lg font-medium rounded-xl"
                >
                  <Download className="w-5 h-5 mr-3" />
                  Télécharger le résumé
                </Button>
                <Button
                  onClick={resetApp}
                  variant="outline"
                  className="border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/50 hover:border-blue-500/50 py-4 sm:py-6 px-6 sm:px-10 rounded-xl flex-1"
                >
                  Analyser un autre document
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}