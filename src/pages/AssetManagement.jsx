import React, { useState, useEffect, useMemo } from 'react'
import {
  Boxes, Package, Wrench, UserCheck, CheckCircle, CircleDollarSign, CalendarClock,
  History, Search, Plus, Filter, Download, Building2, Truck, ShieldCheck, AlertTriangle,
  QrCode, Barcode, Bot, Sparkles, RefreshCw, Layers, Eye, Send, Check, X, Tag, Laptop,
  Cpu, Smartphone, Car, Shield, FileText, ArrowRightLeft, Clock, DollarSign, Award,
  Sliders, UserMinus, BarChart3, PieChart, FileCheck, AlertCircle, Scan, Trash2, Edit3,
  MapPin, CheckSquare, ShieldAlert
} from 'lucide-react'
import { useDepartment } from '../contexts/DepartmentContext'
import { useNotifications } from '../contexts/NotificationContext'
import {
  PageHeader,
  StatCard,
  StatusBadge,
  EmptyState,
  Modal,
  SearchInput
} from '../components/ui'

// Mock Data Generators for Enterprise Asset & Warehouse OS
const INITIAL_ASSETS = [
  {
    id: 'AST-2026-001',
    assetTag: 'TAG-ENG-082',
    name: 'MacBook Pro 16" M3 Max 64GB',
    category: 'Computers & Laptops',
    deptId: 'dept_eng',
    department: 'Engineering',
    warehouse: 'HQ Central Warehouse',
    zone: 'Zone A - Rack 04',
    serialNumber: 'C02G4012MD6R',
    manufacturer: 'Apple Inc',
    model: 'MacBook Pro 16-inch 2024',
    purchaseDate: '2024-03-15',
    purchaseCost: 3499,
    currentValue: 2624,
    condition: 'EXCELLENT',
    status: 'IN_USE',
    assignedTo: 'David Miller',
    custodian: 'David Miller',
    warrantyExpiry: '2027-03-15',
    depreciationMethod: 'Straight-Line (3 Yrs)',
    nextMaintenance: '2026-09-15',
    qrCode: 'QR-AST-2026-001'
  },
  {
    id: 'AST-2026-002',
    assetTag: 'TAG-ENG-045',
    name: 'Dell UltraSharp 32" 4K USB-C Monitor',
    category: 'Monitors & Displays',
    deptId: 'dept_eng',
    department: 'Engineering',
    warehouse: 'HQ Central Warehouse',
    zone: 'Zone A - Rack 02',
    serialNumber: 'CN-0491823-102',
    manufacturer: 'Dell',
    model: 'U3223QE',
    purchaseDate: '2024-01-10',
    purchaseCost: 850,
    currentValue: 550,
    condition: 'GOOD',
    status: 'IN_USE',
    assignedTo: 'Alex Rivers',
    custodian: 'Alex Rivers',
    warrantyExpiry: '2027-01-10',
    depreciationMethod: 'Straight-Line (3 Yrs)',
    nextMaintenance: '2026-11-01',
    qrCode: 'QR-AST-2026-002'
  },
  {
    id: 'AST-2026-003',
    assetTag: 'TAG-HR-012',
    name: 'Herman Miller Aeron Ergonomic Chair',
    category: 'Furniture',
    deptId: 'dept_hr',
    department: 'People Operations',
    warehouse: 'Floor 3 Store Room',
    zone: 'Aisle B - Bay 01',
    serialNumber: 'HM-AERON-9912',
    manufacturer: 'Herman Miller',
    model: 'Aeron Size B',
    purchaseDate: '2023-06-20',
    purchaseCost: 1250,
    currentValue: 900,
    condition: 'GOOD',
    status: 'IN_USE',
    assignedTo: 'Sarah Jenkins',
    custodian: 'Sarah Jenkins',
    warrantyExpiry: '2035-06-20',
    depreciationMethod: 'Straight-Line (10 Yrs)',
    nextMaintenance: '2027-01-01',
    qrCode: 'QR-AST-2026-003'
  },
  {
    id: 'AST-2026-004',
    assetTag: 'TAG-OPS-090',
    name: 'Toyota RAV4 Hybrid Fleet Vehicle',
    category: 'Vehicles',
    deptId: 'dept_ops',
    department: 'Operations',
    warehouse: 'HQ Fleet Garage',
    zone: 'Bay 03',
    serialNumber: 'VIN-4T1B11HK2839102',
    manufacturer: 'Toyota',
    model: 'RAV4 Hybrid XLE',
    purchaseDate: '2022-11-05',
    purchaseCost: 32000,
    currentValue: 21500,
    condition: 'FAIR',
    status: 'UNDER_MAINTENANCE',
    assignedTo: 'James Wilson',
    custodian: 'James Wilson',
    warrantyExpiry: '2027-11-05',
    depreciationMethod: 'Straight-Line (5 Yrs)',
    nextMaintenance: '2026-08-05',
    qrCode: 'QR-AST-2026-004'
  },
  {
    id: 'AST-2026-005',
    assetTag: 'TAG-ENG-108',
    name: 'Cisco Catalyst 9300 48-Port Switch',
    category: 'Networking Equipment',
    deptId: 'dept_eng',
    department: 'Engineering',
    warehouse: 'EMEA Distribution Hub',
    zone: 'Rack Server Room 1',
    serialNumber: 'FOC2419L0AB',
    manufacturer: 'Cisco Systems',
    model: 'C9300-48P',
    purchaseDate: '2023-09-12',
    purchaseCost: 4500,
    currentValue: 3100,
    condition: 'EXCELLENT',
    status: 'IN_USE',
    assignedTo: 'Shared Infrastructure',
    custodian: 'David Miller',
    warrantyExpiry: '2028-09-12',
    depreciationMethod: 'Straight-Line (5 Yrs)',
    nextMaintenance: '2026-10-15',
    qrCode: 'QR-AST-2026-005'
  }
]

const INITIAL_WAREHOUSES = [
  {
    id: 'wh-1',
    name: 'HQ Central Warehouse',
    code: 'WH-HQ-01',
    location: 'Building A, Ground Floor',
    manager: 'Robert Vance',
    zonesCount: 8,
    totalItems: 420,
    totalValue: 385000,
    capacityPct: 78
  },
  {
    id: 'wh-2',
    name: 'Floor 3 Store Room',
    code: 'WH-FL3-02',
    location: 'Main Tower, Floor 3',
    manager: 'Emma Watson',
    zonesCount: 3,
    totalItems: 110,
    totalValue: 92000,
    capacityPct: 45
  },
  {
    id: 'wh-3',
    name: 'EMEA Distribution Hub',
    code: 'WH-EMEA-03',
    location: 'London Depot, Unit 4',
    manager: 'Claire Dupont',
    zonesCount: 12,
    totalItems: 850,
    totalValue: 740000,
    capacityPct: 88
  }
]

const INITIAL_CONSUMABLES = [
  {
    id: 'csm-1',
    name: 'HP LaserJet Enterprise Toner Cartridge Black',
    category: 'Printer Toner',
    deptId: 'dept_ops',
    warehouse: 'HQ Central Warehouse',
    stockLevel: 14,
    minStock: 10,
    maxStock: 50,
    unitCost: 120,
    reorderStatus: 'NORMAL'
  },
  {
    id: 'csm-2',
    name: 'CAT6A Shielded Ethernet Cable 10ft (Box x50)',
    category: 'IT Supplies',
    deptId: 'dept_eng',
    warehouse: 'HQ Central Warehouse',
    stockLevel: 4,
    minStock: 8,
    maxStock: 30,
    unitCost: 180,
    reorderStatus: 'LOW_STOCK'
  },
  {
    id: 'csm-3',
    name: 'Ergonomic Keyboard & Mouse Combos',
    category: 'Peripherals',
    deptId: 'dept_hr',
    warehouse: 'Floor 3 Store Room',
    stockLevel: 18,
    minStock: 5,
    maxStock: 25,
    unitCost: 95,
    reorderStatus: 'NORMAL'
  }
]

const INITIAL_CHECKOUTS = [
  {
    id: 'chk-101',
    assetTag: 'TAG-ENG-082',
    assetName: 'MacBook Pro 16" M3 Max',
    borrower: 'David Miller',
    deptId: 'dept_eng',
    checkoutDate: '2026-07-01',
    expectedReturn: '2026-08-30',
    status: 'ACTIVE_LOAN',
    conditionOnCheckout: 'NEW',
    signatureConfirmed: true
  },
  {
    id: 'chk-102',
    assetTag: 'TAG-OPS-090',
    assetName: 'Toyota RAV4 Hybrid Vehicle',
    borrower: 'James Wilson',
    deptId: 'dept_ops',
    checkoutDate: '2026-07-28',
    expectedReturn: '2026-08-02',
    status: 'OVERDUE',
    conditionOnCheckout: 'GOOD',
    signatureConfirmed: true
  }
]

const INITIAL_MAINTENANCE = [
  {
    id: 'mnt-01',
    assetTag: 'TAG-OPS-090',
    assetName: 'Toyota RAV4 Hybrid Vehicle',
    type: 'CORRECTIVE_REPAIR',
    deptId: 'dept_ops',
    vendor: 'Toyota Official Service Center',
    scheduledDate: '2026-08-01',
    estCost: 650,
    status: 'IN_PROGRESS',
    notes: 'Brake pads replacement and 40,000 mile hybrid battery checkup.'
  },
  {
    id: 'mnt-02',
    assetTag: 'TAG-ENG-108',
    assetName: 'Cisco Catalyst 9300 Switch',
    type: 'PREVENTIVE_SERVICE',
    deptId: 'dept_eng',
    vendor: 'Cisco TAC Support',
    scheduledDate: '2026-08-15',
    estCost: 300,
    status: 'SCHEDULED',
    notes: 'Firmware upgrade to IOS XE 17.12 and port security audit.'
  }
]

const INITIAL_LICENSES = [
  {
    id: 'lic-01',
    name: 'JetBrains All Products Enterprise License',
    vendor: 'JetBrains s.r.o.',
    deptId: 'dept_eng',
    allocatedSeats: 45,
    totalSeats: 50,
    costPerSeat: 299,
    annualCost: 14950,
    expiryDate: '2026-11-30',
    complianceStatus: 'COMPLIANT'
  },
  {
    id: 'lic-02',
    name: 'Microsoft 365 E5 Enterprise Suite',
    vendor: 'Microsoft Corp',
    deptId: 'dept_hr',
    allocatedSeats: 210,
    totalSeats: 220,
    costPerSeat: 420,
    annualCost: 92400,
    expiryDate: '2027-04-15',
    complianceStatus: 'COMPLIANT'
  },
  {
    id: 'lic-03',
    name: 'Figma Enterprise Organization Seats',
    vendor: 'Figma Inc',
    deptId: 'dept_eng',
    allocatedSeats: 28,
    totalSeats: 25,
    costPerSeat: 540,
    annualCost: 13500,
    expiryDate: '2026-08-20',
    complianceStatus: 'OVER_ALLOCATED'
  }
]

export default function AssetManagement() {
  const {
    departments,
    activeDepartmentId,
    setActiveDepartmentId,
    userDepartment,
    filterByDepartment,
    isDepartmentScoped
  } = useDepartment()

  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((msg) => console.log(msg))

  // Main Operating Tabs
  const [activeTab, setActiveTab] = useState('overview') // overview, assets, warehouses, inventory, checkouts, maintenance, licenses, scanner, ai, analytics, audit
  const [searchQuery, setSearchQuery] = useState('')

  // OS Data States
  const [assets, setAssets] = useState(INITIAL_ASSETS)
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES)
  const [consumables, setConsumables] = useState(INITIAL_CONSUMABLES)
  const [checkouts, setCheckouts] = useState(INITIAL_CHECKOUTS)
  const [maintenance, setMaintenance] = useState(INITIAL_MAINTENANCE)
  const [licenses, setLicenses] = useState(INITIAL_LICENSES)

  // Scanner Simulator State
  const [scannedTag, setScannedTag] = useState('')
  const [scanResult, setScanResult] = useState(null)

  // Modals & Form State
  const [modalMode, setModalMode] = useState(null) // 'new_asset', 'checkout_asset', 'new_maintenance'
  const [selectedAsset, setSelectedAsset] = useState(null)

  const [assetForm, setAssetForm] = useState({
    name: '',
    category: 'Computers & Laptops',
    serialNumber: '',
    manufacturer: '',
    model: '',
    purchaseCost: 1500,
    warehouse: 'HQ Central Warehouse',
    zone: 'Zone A - Rack 01',
    condition: 'EXCELLENT'
  })

  // Filtered views based on Department Scope
  const filteredAssets = useMemo(() => filterByDepartment(assets), [assets, activeDepartmentId])
  const filteredConsumables = useMemo(() => filterByDepartment(consumables), [consumables, activeDepartmentId])
  const filteredCheckouts = useMemo(() => filterByDepartment(checkouts), [checkouts, activeDepartmentId])
  const filteredMaintenance = useMemo(() => filterByDepartment(maintenance), [maintenance, activeDepartmentId])
  const filteredLicenses = useMemo(() => filterByDepartment(licenses), [licenses, activeDepartmentId])

  const currentDeptObj = useMemo(() => {
    return departments.find((d) => d.id === activeDepartmentId) || userDepartment || departments[0]
  }, [departments, activeDepartmentId, userDepartment])

  // Handlers
  const handleRegisterAsset = (e) => {
    e.preventDefault()
    if (!assetForm.name) return

    const newTag = `TAG-${currentDeptObj.code}-${Math.floor(100 + Math.random() * 900)}`
    const newAsset = {
      id: `AST-2026-${Math.floor(100 + Math.random() * 900)}`,
      assetTag: newTag,
      name: assetForm.name,
      category: assetForm.category,
      deptId: activeDepartmentId === 'ALL' ? 'dept_eng' : activeDepartmentId,
      department: currentDeptObj.name,
      warehouse: assetForm.warehouse,
      zone: assetForm.zone,
      serialNumber: assetForm.serialNumber || `SN-${Date.now()}`,
      manufacturer: assetForm.manufacturer || 'Enterprise Vendor',
      model: assetForm.model || 'Standard Edition',
      purchaseDate: new Date().toISOString().split('T')[0],
      purchaseCost: Number(assetForm.purchaseCost),
      currentValue: Number(assetForm.purchaseCost),
      condition: assetForm.condition,
      status: 'AVAILABLE',
      assignedTo: 'Unassigned',
      custodian: 'Department Manager',
      warrantyExpiry: '2028-08-01',
      depreciationMethod: 'Straight-Line (3 Yrs)',
      nextMaintenance: '2026-12-01',
      qrCode: `QR-${newTag}`
    }

    setAssets([newAsset, ...assets])
    setModalMode(null)
    setAssetForm({
      name: '',
      category: 'Computers & Laptops',
      serialNumber: '',
      manufacturer: '',
      model: '',
      purchaseCost: 1500,
      warehouse: 'HQ Central Warehouse',
      zone: 'Zone A - Rack 01',
      condition: 'EXCELLENT'
    })
    showSuccess(`Asset ${newAsset.assetTag} (${newAsset.name}) registered in ${currentDeptObj.name}!`)
  }

  const handleSimulateScan = (tagToScan) => {
    const found = assets.find((a) => a.assetTag.toLowerCase() === tagToScan.toLowerCase() || a.qrCode.toLowerCase() === tagToScan.toLowerCase() || a.id.toLowerCase() === tagToScan.toLowerCase())
    if (found) {
      setScanResult(found)
      showSuccess(`Asset found: ${found.name} (${found.assetTag})`)
    } else {
      setScanResult(null)
      notifications?.error?.(`No registered asset matching tag "${tagToScan}".`)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <PageHeader
        title="Enterprise Asset & Warehouse OS"
        description={`Lifecycle tracking, warehouse management, barcodes/QR codes, software licenses, and AI maintenance prediction for ${currentDeptObj.name}.`}
        icon={Boxes}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalMode('new_asset')}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus size={14} /> Register Asset
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <Scan size={14} /> Barcode / QR Scanner
            </button>
          </div>
        }
      />

      {/* Main OS Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Asset Overview', icon: BarChart3 },
          { id: 'assets', label: 'Asset Registry', icon: Laptop, badge: filteredAssets.length },
          { id: 'warehouses', label: 'Warehouses & Stores', icon: Building2, badge: warehouses.length },
          { id: 'inventory', label: 'Consumables & Stock', icon: Package, badge: filteredConsumables.filter(c => c.reorderStatus === 'LOW_STOCK').length },
          { id: 'checkouts', label: 'Check-In / Out', icon: UserCheck, badge: filteredCheckouts.filter(c => c.status === 'OVERDUE').length },
          { id: 'maintenance', label: 'Maintenance & Repairs', icon: Wrench, badge: filteredMaintenance.length },
          { id: 'licenses', label: 'Software Licenses', icon: ShieldCheck, badge: filteredLicenses.filter(l => l.complianceStatus === 'OVER_ALLOCATED').length },
          { id: 'scanner', label: 'Barcode & QR Scanner', icon: Scan },
          { id: 'ai', label: 'AI Asset Copilot', icon: Bot },
          { id: 'analytics', label: 'Depreciation & Valuation', icon: PieChart },
          { id: 'audit', label: 'Audit Trail', icon: FileCheck },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Laptop}
              label="Total Department Assets"
              value={filteredAssets.length}
              color="indigo"
            />
            <StatCard
              icon={DollarSign}
              label="Asset Portfolio Valuation"
              value={`$${filteredAssets.reduce((sum, a) => sum + a.currentValue, 0).toLocaleString()}`}
              color="emerald"
            />
            <StatCard
              icon={Wrench}
              label="Under Maintenance"
              value={filteredAssets.filter(a => a.status === 'UNDER_MAINTENANCE').length}
              color="amber"
            />
            <StatCard
              icon={AlertCircle}
              label="Overdue Loans / Checkouts"
              value={filteredCheckouts.filter(c => c.status === 'OVERDUE').length}
              color="rose"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Asset Registry Snapshot & Warehouse Capacity */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Laptop size={18} className="text-indigo-600 dark:text-indigo-400" />
                    Key Registered Assets & Conditions
                  </h3>
                  <button onClick={() => setActiveTab('assets')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View Registry
                  </button>
                </div>

                <div className="space-y-3">
                  {filteredAssets.map((ast) => (
                    <div key={ast.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{ast.assetTag}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{ast.name}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Category: {ast.category} • Location: {ast.warehouse} ({ast.zone}) • Assigned: {ast.assignedTo}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">${ast.currentValue.toLocaleString()}</span>
                        <StatusBadge status={ast.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance Schedule */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Wrench size={18} className="text-amber-600 dark:text-amber-400" />
                    Scheduled Preventive Maintenance & Repairs
                  </h3>
                  <button onClick={() => setActiveTab('maintenance')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    Manage SLA
                  </button>
                </div>

                <div className="space-y-2.5">
                  {filteredMaintenance.map((m) => (
                    <div key={m.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{m.assetName}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono">{m.assetTag}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">Vendor: {m.vendor} • Scheduled: {m.scheduledDate}</p>
                      </div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">${m.estCost}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Warehouse Capacity & License Compliance */}
            <div className="space-y-6">
              {/* Warehouse Capacity Overview */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 size={18} className="text-purple-600 dark:text-purple-400" />
                    Warehouse & Store Capacities
                  </h3>
                  <button onClick={() => setActiveTab('warehouses')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View Details
                  </button>
                </div>

                <div className="space-y-3">
                  {warehouses.map((wh) => (
                    <div key={wh.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>{wh.name}</span>
                        <span className="font-mono text-indigo-600 dark:text-indigo-400">{wh.capacityPct}% Full</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-full rounded-full transition-all" style={{ width: `${wh.capacityPct}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>{wh.totalItems} Items Stored</span>
                        <span>Valuation: ${wh.totalValue.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Software License Watch */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  Software Licenses & Compliance
                </h3>
                <div className="space-y-2">
                  {filteredLicenses.map((lic) => (
                    <div key={lic.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>{lic.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          lic.complianceStatus === 'OVER_ALLOCATED' ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-emerald-100 text-emerald-800 font-bold'
                        }`}>
                          {lic.complianceStatus}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                        <span>Allocated: {lic.allocatedSeats} / {lic.totalSeats} Seats</span>
                        <span>Annual: ${lic.annualCost.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ASSET REGISTRY */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Master Asset Registry</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Complete catalog of hardware, furniture, tools, and equipment assigned to {currentDeptObj.name}.</p>
              </div>
              <button onClick={() => setModalMode('new_asset')} className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer">
                <Plus size={14} /> Register New Asset
              </button>
            </div>

            <div className="space-y-3">
              {filteredAssets.map((ast) => (
                <div key={ast.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono font-black text-xs">
                        {ast.assetTag}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{ast.name}</h4>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          {ast.category} • S/N: {ast.serialNumber} • Model: {ast.model} ({ast.manufacturer})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-black text-sm text-slate-900 dark:text-white">${ast.currentValue.toLocaleString()}</span>
                      <StatusBadge status={ast.status} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-500">
                    <span>Assigned: <strong className="text-slate-900 dark:text-white">{ast.assignedTo}</strong></span>
                    <span>Warehouse: <strong className="text-slate-900 dark:text-white">{ast.warehouse}</strong></span>
                    <span>Condition: <strong className="text-emerald-600">{ast.condition}</strong></span>
                    <span>Warranty: <strong className="text-slate-900 dark:text-white">{ast.warrantyExpiry}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WAREHOUSES & STORES */}
      {activeTab === 'warehouses' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Enterprise Warehouses, Store Rooms & Zones</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {warehouses.map((wh) => (
                <div key={wh.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block">{wh.code}</span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{wh.name}</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      {wh.zonesCount} Zones
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] flex items-center gap-1">
                    <MapPin size={12} /> {wh.location} • Manager: {wh.manager}
                  </p>
                  <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>Occupancy Rate</span>
                      <span className="font-bold text-slate-900 dark:text-white">{wh.capacityPct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full transition-all" style={{ width: `${wh.capacityPct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: BARCODE & QR SCANNER */}
      {activeTab === 'scanner' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white font-bold">
                <Scan size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Barcode & QR Code Scanner Hub</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Mobile camera simulation for rapid physical inventory verification and asset check-in/out.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-4 text-center max-w-lg mx-auto">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-indigo-500/20 border-2 border-dashed border-indigo-400 flex items-center justify-center text-indigo-400 animate-pulse">
                <QrCode size={48} />
              </div>
              <p className="text-xs text-slate-300">Point scanner at asset QR code or enter barcode tag manually below:</p>

              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="e.g. TAG-ENG-082 or QR-AST-2026-001"
                  value={scannedTag}
                  onChange={(e) => setScannedTag(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <button
                  onClick={() => handleSimulateScan(scannedTag)}
                  className="btn-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Search size={14} /> Scan
                </button>
              </div>
            </div>

            {/* Scan Result Details Card */}
            {scanResult && (
              <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 space-y-3 max-w-lg mx-auto text-xs">
                <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white text-sm">
                  <span>{scanResult.name}</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{scanResult.assetTag}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                  <span>Category: {scanResult.category}</span>
                  <span>Status: {scanResult.status}</span>
                  <span>Assigned: {scanResult.assignedTo}</span>
                  <span>Warehouse: {scanResult.warehouse}</span>
                  <span>Value: ${scanResult.currentValue.toLocaleString()}</span>
                  <span>S/N: {scanResult.serialNumber}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 9: AI ASSET ASSISTANT */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white font-bold">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Asset & Maintenance Copilot</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Predictive maintenance forecasting, low stock alerts, replacement recommendations, and depreciation insights.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                  <Wrench size={16} /> Predictive Maintenance Alert
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Toyota RAV4 Hybrid Vehicle (TAG-OPS-090) telemetry indicates high mileage wear. Recommending schedule brake and hybrid battery service immediately to avoid unexpected downtime.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300">
                  <Package size={16} /> Consumable Stock Replenishment Needed
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  CAT6A Shielded Ethernet Cable stock in HQ Central Warehouse is currently at 4 boxes (Min Threshold: 8). Automated PR generated for Engineering approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER NEW ASSET MODAL */}
      {modalMode === 'new_asset' && (
        <Modal
          open={true}
          onClose={() => setModalMode(null)}
          title={`Register Asset for ${currentDeptObj.name}`}
          size="md"
        >
          <form onSubmit={handleRegisterAsset} className="space-y-4 text-xs">
            <div>
              <label className="label">Asset Name / Equipment Title *</label>
              <input
                className="input"
                placeholder="e.g. MacBook Pro 16 M3 Max"
                value={assetForm.name}
                onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Category</label>
                <select
                  className="input"
                  value={assetForm.category}
                  onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value })}
                >
                  <option value="Computers & Laptops">Computers & Laptops</option>
                  <option value="Monitors & Displays">Monitors & Displays</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Networking Equipment">Networking Equipment</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Medical & Lab">Medical & Lab</option>
                </select>
              </div>
              <div>
                <label className="label">Condition</label>
                <select
                  className="input"
                  value={assetForm.condition}
                  onChange={(e) => setAssetForm({ ...assetForm, condition: e.target.value })}
                >
                  <option value="EXCELLENT">Excellent / Brand New</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                  <option value="POOR">Poor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Serial Number</label>
                <input
                  className="input"
                  placeholder="e.g. C02G4012MD6R"
                  value={assetForm.serialNumber}
                  onChange={(e) => setAssetForm({ ...assetForm, serialNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Manufacturer</label>
                <input
                  className="input"
                  placeholder="e.g. Apple Inc"
                  value={assetForm.manufacturer}
                  onChange={(e) => setAssetForm({ ...assetForm, manufacturer: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Purchase Cost ($)</label>
                <input
                  type="number"
                  className="input"
                  value={assetForm.purchaseCost}
                  onChange={(e) => setAssetForm({ ...assetForm, purchaseCost: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Assigned Warehouse</label>
                <select
                  className="input"
                  value={assetForm.warehouse}
                  onChange={(e) => setAssetForm({ ...assetForm, warehouse: e.target.value })}
                >
                  <option value="HQ Central Warehouse">HQ Central Warehouse</option>
                  <option value="Floor 3 Store Room">Floor 3 Store Room</option>
                  <option value="EMEA Distribution Hub">EMEA Distribution Hub</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onClick={() => setModalMode(null)} className="btn-secondary text-xs">
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs">
                Register Asset
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
