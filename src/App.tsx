/** @format */

import React, { Component } from 'react';
import './App.scss';
import 'antd/dist/antd.css';
import AppLayout from './Components/Layout';
import { Spin } from 'antd';
import { initStore, updateLoopTimes } from './Store/ReduxStore';
import { EnhancedStore } from '@reduxjs/toolkit';
declare global {
	interface Window {
		require: any;
	}
}

interface Props {}

interface State {
	config: G14Config | undefined;
	store: EnhancedStore<G14Config> | undefined;
}

export default class App extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			config: undefined,
			store: undefined,
		};
	}

	loadConfig = async () => {
		let config = await window.ipcRenderer.invoke('loadConfig');
		if (config) {
			let parsedConfig: G14Config = JSON.parse(config);
			console.log(parsedConfig);
			let store = await initStore(parsedConfig);
			store.dispatch(updateLoopTimes({ temp: 1000, load: 1000 }));
			this.setState({ config: config, store });
		}
	};

	componentDidMount() {
		this.loadConfig();
	}
	render() {
		let { config } = this.state;
		if (config) {
			return (
				<div className="scrollbehavior">
					<div
						id="topDrag"
						className="topDrag"
						style={{
							width: '100%',
							height: '20px',
						}}></div>
					<AppLayout></AppLayout>
				</div>
			);
		} else {
			return (
				<Spin
					spinning={true}
					size="large"
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: '40%',
						alignContent: 'center',
					}}></Spin>
			);
		}
	}
}
