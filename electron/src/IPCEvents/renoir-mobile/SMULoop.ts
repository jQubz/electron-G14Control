/** @format */

import cp from 'child_process';
import dotenv from 'dotenv';
import is_dev from 'electron-is-dev';
import { EventEmitter } from 'events';
import getLogger from '../../Logger';
import path from 'path';
dotenv.config();

const LOGGER = getLogger('SMULoop');

const RMOB_LOC = is_dev
	? process.env.RMOB_LOC
	: path.join(
			process.execPath,
			'..',
			'resources',
			'renoirMobile',
			'renoir-mobile.exe'
	  );

export class SMULoop extends EventEmitter {
	loop: cp.ChildProcessWithoutNullStreams;
	constructor() {
		super();
		this.loop = undefined;
	}

	start = () => {
		if (!this.alive()) {
			this.loop = cp.spawn(RMOB_LOC);
			this.loop.stdout.on('data', this.handleData);
			this.loop.stderr.on('data', this.handleError);
		}
	};

	private handleData = (data: Buffer) => {
		let arr = data.toString();
		if (arr.indexOf('StapmTimeConstant') !== -1) {
			try {
				let smuresponse: { values: SMUData[] } = JSON.parse(arr);
				this.emit('smuData', smuresponse.values);
			} catch (e) {
				LOGGER.info(`Error parsing SMU data. ${e}`);
			}
		}
	};

	private handleError = (chunk: Buffer) => {
		LOGGER.error(`Error from renoir-mobile:\n${chunk.toString('utf-8')}`);
		this.emit('smuError', chunk.toString('utf-8'));
	};

	alive = () => {
		return this.loop && !this.loop.killed;
	};

	stop = () => {
		if (this.loop) {
			this.loop.stderr.pause();
			this.loop.stdout.pause();
			this.loop.kill();
		}
		return {
			listeners: this.listenerCount('smuData') + this.listenerCount('smuError'),
		};
	};
}
