/** @format */

import { BrowserWindow, IpcMain } from 'electron';
import { buildAtrofacListeners } from './AtrofacListeners';
import { buildBatterySaverListener } from './BatteryListener';
import { buildConfigLoaderListeners } from './ConfigLoader';
import { buildCPUBoostListeners } from './CPUBoostListeners';
import { buildElectronListeners } from './ElectronConfigListeners';
import { buildG14ControlPlanListeners } from './G14ControlPlans';
import { buildGPUListeners } from './GpuEventListeners';
import { buildMonitoringListeners } from './Monitoring';
import { buildRogKeyRemapperListener } from './RogKeyRemapperListener';
import { buildRyzenADJListeners } from './RyzenADJListener';
import { buildStartupListeners } from './StartupChecks';
import { buildStatusListeners } from './StatusListeners';
import { buildWindowsPlanListeners } from './WindowsPlanListeners';

export function buildIpcConnection(ipc: IpcMain, win: BrowserWindow) {
	buildWindowsPlanListeners(ipc, win);
	buildCPUBoostListeners(ipc, win);
	buildRyzenADJListeners(ipc, win);
	buildAtrofacListeners(ipc, win);
	buildConfigLoaderListeners(ipc);
	buildStatusListeners(ipc, win);
	buildGPUListeners(ipc, win);
	buildElectronListeners(ipc, win);
	buildStartupListeners(ipc);
	buildBatterySaverListener(win, ipc);
	buildRogKeyRemapperListener(win, ipc);
	buildG14ControlPlanListeners(win, ipc);
	buildMonitoringListeners(win, ipc);
}
