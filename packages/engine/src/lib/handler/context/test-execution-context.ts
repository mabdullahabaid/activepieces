import { ActionType, BranchStepOutput, flowHelper, FlowVersion, GenericStepOutput, LoopStepOutput, StepOutputStatus, TriggerType } from '@activepieces/shared'
import { variableService } from '../../variables/variable-service'
import { FlowExecutorContext } from './flow-execution-context'

export const testExecutionContext = {
    async stateFromFlowVersion({ flowVersion, sampleData, excludedStepName, projectId, engineToken, apiUrl }: {
        flowVersion: FlowVersion
        excludedStepName?: string
        projectId: string
        apiUrl: string
        engineToken: string
        sampleData: Record<string, unknown>
    }): Promise<FlowExecutorContext> {
        const flowSteps = flowHelper.getAllSteps(flowVersion.trigger)
        let flowExecutionContext = FlowExecutorContext.empty()

        for (const step of flowSteps) {
            const { name } = step
            if (name === excludedStepName) {
                continue
            }

            const stepType = step.type
            switch (stepType) {
                case ActionType.BRANCH:
                    flowExecutionContext = flowExecutionContext.upsertStep(step.name, BranchStepOutput.init({
                        input: step.settings,
                    }))
                    break
                case ActionType.LOOP_ON_ITEMS: {
                    const { resolvedInput } = await variableService({
                        apiUrl,
                        projectId,
                        engineToken,
                    }).resolve<{ items: unknown[] }>({
                        unresolvedInput: step.settings,
                        executionState: flowExecutionContext,
                    })
                    flowExecutionContext = flowExecutionContext.upsertStep(step.name, LoopStepOutput.init({
                        input: step.settings,
                    }).setOutput({
                        item: resolvedInput.items[0],
                        index: 1,
                        iterations: [],
                    }))
                    break
                }
                case ActionType.PIECE:
                case ActionType.CODE:
                case TriggerType.EMPTY:
                case TriggerType.PIECE:
                    flowExecutionContext = flowExecutionContext.upsertStep(step.name, GenericStepOutput.create({
                        input: step.settings,
                        type: stepType,
                        status: StepOutputStatus.SUCCEEDED,
                        output: sampleData[step.name],
                    }))
                    break
            }
        }
        return flowExecutionContext
    },
}

