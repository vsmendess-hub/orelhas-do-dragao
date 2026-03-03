import Link from 'next/link';
import { ArrowLeft, Wand2, Users, Coins, Dices, BookOpen, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NameGenerator } from '@/app/components/dm-tools/name-generator';
import { DiceRoller } from '@/app/components/dm-tools/dice-roller';
import { TreasureGenerator } from '@/app/components/dm-tools/treasure-generator';
import { RandomTables } from '@/app/components/dm-tools/random-tables';

export default function DMToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Ferramentas do Mestre</h1>
            <p className="text-sm text-muted-foreground">
              Utilitários para facilitar suas sessões de D&D
            </p>
          </div>
          <Wand2 className="h-6 w-6 text-purple-600" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          {/* Info Banner */}
          <Card className="border-2 border-purple-500/50 bg-purple-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Wand2 className="h-6 w-6 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Bem-vindo, Mestre!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Estas ferramentas foram criadas para agilizar sua preparação e condução de sessões.
                    Use os geradores para criar NPCs, tesouros, e muito mais!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tools Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Dice Roller */}
            <DiceRoller />

            {/* Name Generator */}
            <NameGenerator />

            {/* Treasure Generator */}
            <TreasureGenerator />

            {/* Random Tables */}
            <RandomTables />
          </div>

          {/* Coming Soon */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-600" />
                Em Breve
              </CardTitle>
              <CardDescription>Mais ferramentas serão adicionadas em breve</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Calculadora de Encontros</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>Gerador de Masmorras</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Coins className="h-4 w-4" />
                  <span>Gerador de Lojas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
