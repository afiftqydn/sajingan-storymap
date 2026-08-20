import DashboardMap from './DashboardMap.jsx';
import DashboardStats from './DashboardStats.jsx';
import CasesTable from './CasesTable.jsx';

// Tab "Peta & Data" — dashboard eksplorasi bebas.
export default function DashboardView() {
  return (
    <div className="dashboard-view">
      <DashboardMap />
      <div className="dashboard-view__panels">
        <DashboardStats />
        <CasesTable />
      </div>
    </div>
  );
}
