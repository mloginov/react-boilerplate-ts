import * as React from 'react';
import { App } from './app';
export interface IMainProps {
  app: App;
}
export declare class Main extends React.Component<IMainProps, {}> {
  constructor(props: IMainProps);
  render(): JSX.Element;
}
