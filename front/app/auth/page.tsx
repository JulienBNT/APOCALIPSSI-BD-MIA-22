'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-semibold text-white text-display">
              {isSignUp ? "Créer un compte" : "Connexion"}
            </h2>
            <p className="text-zinc-400 text-body text-sm">
              {isSignUp ? "Rejoignez l'expérience IA" : "Accédez à votre tableau de bord"}
            </p>
          </div>

          <form className="space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <Label htmlFor="name" className="text-white">Nom</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Votre nom"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@domaine.com"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-white">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <Button className="apple-button w-full py-3 text-white font-medium rounded-xl mt-4">
              {isSignUp ? "Créer le compte" : "Se connecter"}
            </Button>
          </form>

          <div className="text-center text-sm text-zinc-400">
            {isSignUp ? "Déjà un compte ? " : "Pas encore de compte ? "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-400 hover:underline ml-1"
            >
              {isSignUp ? "Se connecter" : "Créer un compte"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
