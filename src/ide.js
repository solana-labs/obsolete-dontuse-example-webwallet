import React from 'react';
import {
  Button,
  Glyphicon,
  Navbar,
  Nav,
  NavItem,
  MenuItem,
  FormControl,
  FormGroup,
  DropdownButton,
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap';
import MonacoEditor from 'react-monaco-editor';
import ReactResizeDetector from 'react-resize-detector';
import PropTypes from 'prop-types';
import {Prompt} from 'react-router-dom';

import {Program} from './program';

class OutputHeader extends React.Component {

  render() {
    const clearTooltip = (
      <Tooltip id="clearTooltip">Clear output</Tooltip>
    );
    const closeTooltip = (
      <Tooltip id="closeTooltip">Close</Tooltip>
    );

    return (
      <div>
        <div style={{float: 'left', paddingLeft: '10px'}}>
          <b>Output</b>
        </div>
        <div style={{float: 'right', paddingRight: '10px'}}>
          <OverlayTrigger placement="top" overlay={clearTooltip}>
            <Button bsSize="xsmall" onClick={this.props.onClear}>
              <Glyphicon glyph="ban-circle"/>
            </Button>
          </OverlayTrigger>
          &nbsp;
          <OverlayTrigger placement="top" overlay={closeTooltip}>
            <Button bsSize="xsmall" onClick={this.props.onClose}>
              <Glyphicon glyph="remove"/>
            </Button>
          </OverlayTrigger>
        </div>
      </div>
    );
  }
}
OutputHeader.propTypes = {
  onClear: PropTypes.function,
  onClose: PropTypes.function,
};

class Output extends React.Component {
  propTypes = {
    outputText: PropTypes.string,
  };

  state = {
    editorWidth: '0',
    editorHeight: '200px',
  };

  updateDimensions(width, height) {
    console.log('Updating Output dimensions to', width, height);
    this.setState({
      editorWidth: width,
      editorHeight: height,
    });
  }

  editorDidMount(editor) {
    console.log('editorDidMount', editor, editor.getValue(), editor.getModel());
    this.editor = editor;
  }

  render() {
    const options = {
      contextmenu: false,
      lineNumbers: 'off',
      minimap: {
        enabled: false,
      },
      readOnly: true,
      scrollBeyondLastLine: false,
    };

    return (
      <div style={{
        height: '200px',
      }}>
        <ReactResizeDetector handleWidth handleHeight onResize={::this.updateDimensions}>
          <div style={{
            position: 'fixed',
            width: this.state.editorWidth,
            height: this.state.editorHeight,
            backgroundColor: 'red',
            overflow: 'hidden',
          }}>
            <MonacoEditor
              width={this.state.editorWidth}
              height={this.state.editorHeight}
              language="rust" // c
              value={this.props.outputText}
              options={options}
              editorDidMount={::this.editorDidMount}
            />
          </div>
        </ReactResizeDetector>
      </div>
    );
  }
}


class Editor extends React.Component {
  state = {
    editorWidth: '0',
    editorHeight: '0',
  };

  forceUpdate = () => {
    super.forceUpdate();
  }

  componentDidMount() {
    this.props.program.on('modified', this.forceUpdate);
  }

  cmponentWillUnmount() {
    this.props.program.removeListener('modified', this.forceUpdate);
  }

  onChange(newValue) {
    this.props.program.set('source', newValue);
  }

  editorDidMount(editor) {
    console.log('editorDidMount', editor, editor.getValue(), editor.getModel());
    this.editor = editor;
  }

  updateDimensions(width, height) {
    console.log('Updating Editor dimensions to', width, height);
    this.setState({
      editorWidth: width,
      editorHeight: height,
    });
  }

  render() {
    const options = {
      selectOnLineNumbers: true,
      readOnly: false,
      scrollBeyondLastLine: false,
    };
    return (
      <div style={{
        flexGrow: 1,
      }}>
        <ReactResizeDetector handleWidth handleHeight onResize={::this.updateDimensions}>
          <div style={{
            position: 'fixed',
            width: this.state.editorWidth,
            height: this.state.editorHeight,
            backgroundColor: 'red',
            overflow: 'hidden',
          }}>
            <MonacoEditor
              width={this.state.editorWidth}
              height={this.state.editorHeight}
              language={this.props.program.language.toLowerCase()}
              value={this.props.program.source}
              options={options}
              onChange={::this.onChange}
              editorDidMount={::this.editorDidMount}
            />
          </div>
        </ReactResizeDetector>
      </div>
    );
  }
}
Editor.propTypes = {
  program: PropTypes.object,
};

class LeftPanel extends React.Component {
  programSet(key, value) {
    this.props.program.set(key, value);
  }

  forceUpdate = () => {
    super.forceUpdate();
  }

  componentDidMount() {
    this.props.program.on('modified', this.forceUpdate);
  }

  cmponentWillUnmount() {
    this.props.program.removeListener('modified', this.forceUpdate);
  }

  render() {
    if (!this.props.colapsed) {
      const hidePanelTooltip = (
        <Tooltip id="hidePanelTooltip">Hide panel</Tooltip>
      );

      return (
        <div>
          <div style={{height: '50%', width: this.props.width, margin:'10px'}}>
            <FormGroup>
              <FormControl
                type="text"
                value={this.props.program.name}
                placeholder="Untitled"
                onChange={(e) => this.programSet('name', e.target.value)}
              />
              &nbsp;
              <FormControl
                style={{resize: 'none'}}
                componentClass="textarea"
                rows="3"
                value={this.props.program.description}
                placeholder="No description"
                onChange={(e) => this.programSet('description', e.target.value)}
              />
              <br/>
              Language: &nbsp;
              <DropdownButton
                title={this.props.program.language}
                onSelect={(value) => this.programSet('language', value)}
              >
                <MenuItem eventKey="Rust">Rust</MenuItem>
                <MenuItem eventKey="C">C</MenuItem>
              </DropdownButton>
            </FormGroup>
          </div>
          <div style={{float: 'right'}}>
            <OverlayTrigger placement="right" overlay={hidePanelTooltip}>
              <Glyphicon glyph="chevron-left"  bsSize="xsmall" onClick={() => this.props.onColapse(true)} />
            </OverlayTrigger>
          </div>
        </div>
      );
    } else {
      const showPanelTooltip = (
        <Tooltip id="showPanelTooltip">Show panel</Tooltip>
      );
      return (
        <div style={{display: 'table', height: '100%'}}>
          <div style={{display: 'table-cell', verticalAlign: 'middle'}}>
            <OverlayTrigger placement="right" overlay={showPanelTooltip}>
              <Glyphicon glyph="chevron-right"  bsSize="xsmall" onClick={() => this.props.onColapse(false)} />
            </OverlayTrigger>
          </div>
        </div>
      );
    }
  }
}
LeftPanel.propTypes = {
  colapsed: PropTypes.boolean,
  width: PropTypes.number,
  onColapse: PropTypes.function,
  program: PropTypes.object,
};


export class Ide extends React.Component {
  state = {
    showOutput: false,
    outputText: '',
    leftPanelColapsed: false,
    program: new Program(),
    saving: false,
  };

  forceUpdate = () => {
    super.forceUpdate();
  }

  componentDidMount() {
    this.state.program.on('modified', this.forceUpdate);
    if (this.props.programId) {
      this.state.program.load(this.props.programId);
    }
  }

  cmponentWillUnmount() {
    this.state.program.removeListener('modified', this.forceUpdate);
  }

  onOutputClose() {
    this.setState({showOutput: false});
  }

  onOutputClear() {
    this.setState({outputText: ''});
  }

  onSave() {
    let {program} = this.state;
    this.setState(
      {saving: true},
      () => {
        program.save();
        this.props.history.push(program.uri);
        this.setState({saving: false});
      }
    );
  }

  onBuild() {
    console.log('build');
    this.setState({
      showOutput: true,
      outputText: [...Array(25).keys()].reduce((s, i) => s + `Build result ${i} with a link: http://solana.com\n`, '') + '\nfin\n',
    });
  }

  onDeploy() {
    this.setState({
      showOutput: true,
      outputText: [...Array(25).keys()].reduce((s, i) => s + `Deploy result ${i} with a link: http://solana.com\n`, '') + '\nfin\n',
    });
  }

  onLeftPanelColapse(leftPanelColapsed) {
    this.setState({leftPanelColapsed});
  }

  render() {
    const emptySource = this.state.program.source.length === 0;
    const {modified} = this.state.program;
    const {saving} = this.state;

    const EditorNav = () => (
      <div style={{width: '0px'}}>
        <Navbar style={{marginBottom: '0', border: '0'}}>
          <Nav>
            <NavItem disabled={!saving && !modified} eventKey={1} onClick={::this.onSave}>
              <Glyphicon glyph="cloud-upload" />
              &nbsp; {this.state.program.uri ? 'Update' : 'Save'}
            </NavItem>
            <NavItem disabled={emptySource} eventKey={2} onClick={::this.onBuild}>
              <Glyphicon glyph="play" />
              &nbsp; Build
            </NavItem>
            <NavItem disabled={emptySource} eventKey={3} onClick={::this.onDeploy}>
              <Glyphicon glyph="link" />
              &nbsp; Deploy
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
    return (
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
        backgroundColor: '#f8f8f8',
        position: 'relative',
      }}>
        <Prompt
          when={!saving && this.state.program.modified}
          message={() => 'There are unsaved changes that may be lost if you continue.'}
        />
        <LeftPanel
          width='350px'
          program={this.state.program}
          colapsed={this.state.leftPanelColapsed}
          onColapse={::this.onLeftPanelColapse}
        />
        <div style={{
          position: 'relative',
          width: this.state.leftPanelColapsed ? '98%' : 'calc(98% - 350px)',
          display: 'flex',
          alignItems: 'stretch',
          flexDirection: 'column'
        }}>
          <EditorNav program={this.state.program} />
          <Editor program={this.state.program} />
          {this.state.showOutput ?
            <OutputHeader
              onClear={::this.onOutputClear}
              onClose={::this.onOutputClose}
            />
            : undefined}
          {this.state.showOutput ?
            <Output
              outputText={this.state.outputText}
            />
            : undefined}
        </div>
      </div>
    );
  }
}
Ide.propTypes = {
  programId: PropTypes.string,
  history: PropTypes.object,
};
