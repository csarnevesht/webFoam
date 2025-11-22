import { create } from 'zustand';

export type WorkflowType = 'HOME' | '2D_PARTS' | 'TAPERED' | 'TEXT' | 'ROTARY';

interface WorkflowState {
    currentWorkflow: WorkflowType;
    setWorkflow: (workflow: WorkflowType) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
    currentWorkflow: 'HOME',
    setWorkflow: (workflow) => set({ currentWorkflow: workflow }),
}));
