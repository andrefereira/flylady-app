# FlyLady App

Aplicativo web para aplicar o método FlyLady de limpeza e organização da casa:
zonas semanais, rotinas diárias, timer de 15 minutos, hot spots, desafio de
descarte (decluttering), control journal e acompanhamento de progresso.

Stack: **React + Vite + Tailwind CSS**, autenticação e banco de dados no
**Firebase** (Auth + Firestore), hospedagem no **GitHub Pages**. Já é um
**PWA** (instalável, com ícone e cache offline básico).

## 1. Rodando localmente

```bash
npm install
cp .env.example .env   # depois preencha com as chaves do seu Firebase (passo 2)
npm run dev
```

## 2. Configurando o Firebase

1. Crie um projeto em https://console.firebase.google.com
2. Em **Build > Authentication**, ative o provedor **E-mail/senha**.
3. Em **Build > Firestore Database**, crie o banco (modo produção).
4. Em **Configurações do projeto > Geral > Seus aplicativos**, adicione um
   app Web e copie as credenciais para o arquivo `.env` (baseado no
   `.env.example`).
5. Publique as regras de segurança do arquivo `firestore.rules` deste
   projeto (Firestore > Regras), que garantem que cada usuário só acessa os
   próprios dados.

## 3. Publicando no GitHub Pages

1. Crie um repositório no GitHub e suba este código:
   ```bash
   git init
   git add .
   git commit -m "Primeira versão do FlyLady App"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git push -u origin main
   ```
2. No repositório, vá em **Settings > Pages** e em "Build and deployment"
   escolha **Source: GitHub Actions** (o workflow já está pronto em
   `.github/workflows/deploy.yml`).
3. Em **Settings > Secrets and variables > Actions**, cadastre os 6 segredos
   com os mesmos nomes do `.env.example` (ex: `VITE_FIREBASE_API_KEY`) com os
   valores do seu projeto Firebase.
4. Todo push na branch `main` publica automaticamente. A URL final fica algo
   como `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/`.
5. Em **Authentication > Settings > Authorized domains** no Firebase,
   adicione esse domínio do GitHub Pages para o login funcionar em produção.

## Funcionalidades incluídas

- **Zonas da casa**: 5 zonas com rotação automática semanal e checklist por
  zona.
- **Rotinas diárias**: checklist de manhã/noite que reseta sozinho todo dia,
  com o hábito de "brilhar a pia" em destaque.
- **Timer de 15 minutos**: embutido na aba de rotinas, com opções de 5/15/30
  minutos e alarme sonoro.
- **Hot Spots**: cadastro livre de pontos recorrentes de bagunça, com botão
  de "resolver" e histórico.
- **Decluttering**: desafio dos 27 itens (contador com reinício automático) e
  hábito diário de descarte de 5 minutos.
- **Control Journal**: bloco de notas livre + listas de checklist totalmente
  personalizáveis pelo usuário.
- **Progresso**: gráfico das rotinas dos últimos 7 dias e totais (itens
  descartados, hot spots resolvidos, zonas com limpeza registrada) — sem
  sequências punitivas, seguindo o lema "progresso, não perfeição".

## PWA (app instalável)

O projeto usa `vite-plugin-pwa` para gerar o manifest e o service worker.
Isso é aplicado mesmo em `npm run dev` (para facilitar o teste), então:

- **No celular**: abra o site no Chrome/Safari e use "Adicionar à tela
  inicial" (Android) ou "Adicionar à Tela de Início" (iOS, no menu de
  compartilhar do Safari).
- **No desktop (Chrome/Edge)**: um ícone de instalação aparece na barra de
  endereço.
- O app funciona parcialmente offline (a interface abre mesmo sem internet;
  os dados continuam precisando do Firebase quando há conexão).
- `registerType: 'autoUpdate'` faz o app atualizar sozinho para a versão mais
  nova sempre que for reaberto, sem exigir nenhuma ação do usuário.
- Os ícones ficam em `public/icon-192.png`, `public/icon-512.png`,
  `public/icon-512-maskable.png` e `public/apple-touch-icon.png` — troque
  esses arquivos (mantendo os mesmos nomes/tamanhos) se quiser um ícone
  próprio.

## Próximos passos para monetização (assinatura)

O login com Firebase Auth já deixa o terreno pronto. Para transformar em um
app pago, os próximos passos seriam: integrar um provedor de pagamentos
(ex: Stripe Checkout + Firebase Extensions "Run Payments with Stripe"),
guardar o status da assinatura no documento do usuário no Firestore, e usar
esse status para liberar/bloquear funcionalidades ou o acesso ao app.

## Estrutura do projeto

```
src/
  components/   Layout, Timer, ChecklistItem, ProgressBar (reutilizáveis)
  contexts/      AuthContext (login/logout/signup)
  hooks/         useUserData (sincronização com o Firestore)
  pages/         Login, Zones, Routines, HotSpots, Decluttering,
                 ControlJournal, Progress
  utils/         dates.js (regras de datas/semanas), defaultState.js
```
