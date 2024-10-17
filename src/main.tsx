import * as React from 'react';
import { Index } from './index';

export interface IMainProps {
  app: Index; // Reference to our App.ts class
}

export class Main extends React.Component<IMainProps, {}> {
  constructor(props: IMainProps) {
    super(props);
  }

  public render(): React.JSX.Element {
    return <>Main app</>;
  }
}
