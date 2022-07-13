import React from 'react';
import ResetButtons from './reset-buttons'
import {EventGroup} from 'shared/components/workbench/events'

const ErrorView = (props) => {
  return (<div>
      {props.children  || (<h2>Something went wrong.</h2>)}
      <EventGroup type="error" events={[props.error]} units={props.gist.units}></EventGroup>
      <ResetButtons undoGist={props.undoGist} resetGist={props.resetGist} />
    </div>)
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log('hit the boundary');
  }

  componentDidUpdate(prevProps) {
    if (this.props.gist !== prevProps.gist) {
      this.setState({hasError: false})
    }
  }

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <ErrorView {...this.props} error={this.state.error}>{this.errorView}</ErrorView>
      // return <h1>FIXME</h1>
    }

    try {
      return this.props.children;
    } catch(e) {
      return <ErrorView {...props} error={e}>this.errorView</ErrorView>;
    }
  }
}

export default ErrorBoundary
