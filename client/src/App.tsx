import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import Home from "./pages/Home";
import Overview from "./pages/Overview";
import MpsRegistry from "./pages/MpsRegistry";
import ProjectsList from "./pages/ProjectsList";
import ProjectDetail from "./pages/ProjectDetail";
import TendersList from "./pages/TendersList";
import ContractsList from "./pages/ContractsList";
import ContractorsList from "./pages/ContractorsList";
import RiskExplorer from "./pages/RiskExplorer";
import InvestigationCentre from "./pages/InvestigationCentre";
import CaseDetail from "./pages/CaseDetail";
import AiInvestigator from "./pages/AiInvestigator";
import DocVerification from "./pages/DocVerification";
import ReportsStudio from "./pages/ReportsStudio";
import DataSources from "./pages/DataSources";

function Router() {
  return (
    <Switch>
      {/* Public Landing Page */}
      <Route path="/" component={Home} />

      {/* Internal Intelligence & Audit Modules */}
      <Route path="/overview" component={Overview} />
      <Route path="/mps" component={MpsRegistry} />
      <Route path="/projects" component={ProjectsList} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/tenders" component={TendersList} />
      <Route path="/contracts" component={ContractsList} />
      <Route path="/contractors" component={ContractorsList} />
      <Route path="/risk" component={RiskExplorer} />
      <Route path="/investigations" component={InvestigationCentre} />
      <Route path="/investigations/:id" component={CaseDetail} />
      <Route path="/ai-investigator" component={AiInvestigator} />
      <Route path="/verify" component={DocVerification} />
      <Route path="/reports" component={ReportsStudio} />
      <Route path="/methodology" component={DataSources} />

      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

import { EvidenceProvider } from "./contexts/EvidenceContext";
import { EvidenceDrawer } from "./components/ui/EvidenceDrawer";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <EvidenceProvider>
            <Toaster />
            <EvidenceDrawer />
            <Router />
          </EvidenceProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
