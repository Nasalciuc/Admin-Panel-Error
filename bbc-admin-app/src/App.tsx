import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminLayout } from './modules/admin/layout/AdminLayout';
import Dashboard from './modules/admin/pages/Dashboard';
import Conversations from './modules/admin/pages/Conversations';
import ConversationDetail from './modules/admin/pages/ConversationDetail';
import Leads from './modules/admin/pages/Leads';
import KnowledgeBase from './modules/admin/pages/KnowledgeBase';
import Settings from './modules/admin/pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/conversations/:id" element={<ConversationDetail />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
