import React, { useState } from 'react'
import { useAutomation } from '@/contexts/AutomationContext'
import {
  Play,
  Plus,
  Trash2,
  Zap,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowDown,
  Settings,
  X,
  FileCode,
  Send,
  Sliders,
  Terminal,
  RotateCw
} from 'lucide-react'

export default function VisualFlowBuilder({ selectedFlow, onBack, onNotify }) {
  const { runSimulation, addFlow } = useAutomation()

  const [flowData, setFlowData] = useState(() => {
    if (selectedFlow) return selectedFlow
    return {
      name: 'Custom New Business Process Automation',
      category: 'General Operations',
      trigger: 'Record Created in StaffRoom',
      description: 'Custom no-code automation flow.',
      nodes: [
        { id: 'n1', type: 'trigger', label: 'Trigger: Record Created', detail: 'Event: StaffRoom Event API' },
        { id: 'n2', type: 'condition', label: 'Condition: IF Priority == High', detail: 'Rule Engine' },
        { id: 'n3', type: 'action', label: 'Action: Send Instant SMS & Push Notification', detail: 'Twilio Channel' },
        { id: 'n4', type: 'ai_action', label: 'AI Action: Generate Smart Summary', detail: 'Gemini 1.5 Flash' }
      ]
    }
  })

  const [activeNode, setActiveNode] = useState(flowData.nodes[0])
  const [testResult, setTestResult] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const handleAddNode = (type) => {
    const newNode = {
      id: `n-${Date.now().toString().slice(-4)}`,
      type,
      label:
        type === 'condition'
          ? 'Condition: IF Department == HR'
          : type === 'action'
          ? 'Action: Send Email / Webhook Call'
          : 'AI Action: Classify & Tag',
      detail: 'Configured Node Parameter'
    }

    setFlowData({
      ...flowData,
      nodes: [...flowData.nodes, newNode]
    })
  }

  const handleRemoveNode = (id) => {
    if (flowData.nodes.length <= 2) return
    setFlowData({
      ...flowData,
      nodes: flowData.nodes.filter((n) => n.id !== id)
    })
  }

  const handleRunTest = () => {
    setIsSimulating(true)
    setTestResult(null)

    setTimeout(() => {
      const log = runSimulation(flowData.id || 'FLOW-001')
      setIsSimulating(false)
      setTestResult({
        success: true,
        duration: '0.9s',
        outputPayload: {
          event: flowData.trigger,
          nodesExecuted: flowData.nodes.length,
          status: 'SUCCESS_200_OK',
          timestamp: new Date().toISOString()
        }
      })
      if (onNotify) onNotify(`Flow Simulation Passed for '${flowData.name}'!`)
    }, 1200)
  }

  const handleSaveFlow = () => {
    addFlow(flowData)
    if (onNotify) onNotify(`Saved & Published Automation Flow: ${flowData.name}`)
    if (onBack) onBack()
  }

  return (
    <div className="space-y-6">
      {/* FLOW HEADER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 text-xs font-mono font-bold hover:bg-slate-200 cursor-pointer"
            >
              ← Back to Flows
            </button>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-mono font-bold">
              {flowData.category}
            </span>
          </div>

          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {flowData.name}
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">{flowData.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunTest}
            disabled={isSimulating}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs shadow-md cursor-pointer flex items-center gap-1.5"
          >
            {isSimulating ? (
              <>
                <RotateCw size={14} className="animate-spin" /> Simulating...
              </>
            ) : (
              <>
                <Play size={14} /> Run Test Simulation
              </>
            )}
          </button>

          <button
            onClick={handleSaveFlow}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs shadow-md cursor-pointer"
          >
            Save & Publish Flow
          </button>
        </div>
      </div>

      {/* VISUAL FLOW CANVAS & NODE CONFIGURATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CANVAS SEQUENCE */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4 min-h-[500px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              <h3 className="font-mono font-bold text-xs text-white">
                Drag & Drop Visual Execution Sequence
              </h3>
            </div>

            <div className="flex gap-2 text-[10px] font-mono">
              <button
                onClick={() => handleAddNode('condition')}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold cursor-pointer"
              >
                + Condition
              </button>
              <button
                onClick={() => handleAddNode('action')}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold cursor-pointer"
              >
                + Action
              </button>
              <button
                onClick={() => handleAddNode('ai_action')}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold cursor-pointer"
              >
                + AI Step
              </button>
            </div>
          </div>

          {/* NODES CHAIN */}
          <div className="flex flex-col items-center space-y-3 py-4">
            {flowData.nodes.map((node, index) => {
              const isSelected = activeNode?.id === node.id

              let nodeBg = 'bg-slate-800 border-slate-700 text-white'
              if (node.type === 'trigger') nodeBg = 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
              if (node.type === 'condition') nodeBg = 'bg-amber-950/80 border-amber-600 text-amber-200'
              if (node.type === 'ai_action') nodeBg = 'bg-cyan-950/80 border-cyan-600 text-cyan-200'
              if (node.type === 'action') nodeBg = 'bg-indigo-950/80 border-indigo-600 text-indigo-200'

              return (
                <React.Fragment key={node.id}>
                  {index > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-0.5 bg-slate-700"></div>
                      <ArrowDown size={14} className="text-slate-500 my-0.5" />
                    </div>
                  )}

                  <div
                    onClick={() => setActiveNode(node)}
                    className={`w-full max-w-md p-4 rounded-2xl border ${nodeBg} transition-all cursor-pointer shadow-md flex items-center justify-between space-x-3 ${
                      isSelected ? 'ring-2 ring-indigo-400 scale-[1.02]' : 'hover:border-slate-500'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] uppercase font-black tracking-wider opacity-70">
                        STEP 0{index + 1} • {node.type.toUpperCase()}
                      </span>
                      <strong className="block text-xs font-bold leading-snug">
                        {node.label}
                      </strong>
                      <span className="font-mono text-[10px] opacity-80 block">
                        {node.detail}
                      </span>
                    </div>

                    {node.type !== 'trigger' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveNode(node.id)
                        }}
                        className="text-rose-400 hover:text-rose-200 p-1 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* RIGHT SIDE NODE INSPECTOR & TEST CONSOLE */}
        <div className="space-y-4">
          {/* NODE CONFIG PANEL */}
          {activeNode && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Settings size={15} className="text-indigo-600" />
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  Configure Selected Node ({activeNode.type})
                </h4>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Step Label
                </label>
                <input
                  type="text"
                  value={activeNode.label}
                  onChange={(e) => {
                    const val = e.target.value
                    setActiveNode({ ...activeNode, label: val })
                    setFlowData({
                      ...flowData,
                      nodes: flowData.nodes.map((n) => (n.id === activeNode.id ? { ...n, label: val } : n))
                    })
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Rule & Execution Detail
                </label>
                <input
                  type="text"
                  value={activeNode.detail}
                  onChange={(e) => {
                    const val = e.target.value
                    setActiveNode({ ...activeNode, detail: val })
                    setFlowData({
                      ...flowData,
                      nodes: flowData.nodes.map((n) => (n.id === activeNode.id ? { ...n, detail: val } : n))
                    })
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                />
              </div>
            </div>
          )}

          {/* SIMULATION DEBUG OUTPUT */}
          {testResult && (
            <div className="p-5 rounded-3xl bg-slate-950 border border-emerald-800 text-emerald-400 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-white">
                <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <CheckCircle2 size={15} /> Flow Test Passed
                </span>
                <span>Latency: {testResult.duration}</span>
              </div>

              <pre className="text-[10px] overflow-x-auto text-cyan-300 leading-relaxed">
                {JSON.stringify(testResult.outputPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
