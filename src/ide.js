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

const keygen_rs = `
// Contents of https://github.com/solana-labs/solana/blob/master/src/bin/keygen.rs
#[macro_use]
extern crate clap;
extern crate dirs;
extern crate ring;
extern crate serde_json;

use clap::{App, Arg};
use ring::rand::SystemRandom;
use ring::signature::Ed25519KeyPair;
use std::error;
use std::fs::{self, File};
use std::io::Write;
use std::path::Path;

fn main() -> Result<(), Box<error::Error>> {
    let matches = App::new("solana-keygen")
        .version(crate_version!())
        .arg(
            Arg::with_name("outfile")
                .short("o")
                .long("outfile")
                .value_name("PATH")
                .takes_value(true)
                .help("path to generated file"),
        )
        .get_matches();

    let rnd = SystemRandom::new();
    let pkcs8_bytes = Ed25519KeyPair::generate_pkcs8(&rnd)?;
    let serialized = serde_json::to_string(&pkcs8_bytes.to_vec())?;

    let mut path = dirs::home_dir().expect("home directory");
    let outfile = if matches.is_present("outfile") {
        matches.value_of("outfile").unwrap()
    } else {
        path.extend(&[".config", "solana", "id.json"]);
        path.to_str().unwrap()
    };

    if outfile == "-" {
        println!("{}", serialized);
    } else {
        if let Some(outdir) = Path::new(outfile).parent() {
            fs::create_dir_all(outdir)?;
        }
        let mut f = File::create(outfile)?;
        f.write_all(&serialized.into_bytes())?;
    }

    Ok(())
}
`;

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
            <Button bsSize="xsmall" onClick={() => alert('TODO: Clear output pane')}>
              <Glyphicon glyph="ban-circle"/>
            </Button>
          </OverlayTrigger>
          &nbsp;
          <OverlayTrigger placement="top" overlay={closeTooltip}>
            <Button bsSize="xsmall" onClick={() => alert('TODO: Hide output pane')}>
              <Glyphicon glyph="remove"/>
            </Button>
          </OverlayTrigger>
        </div>
      </div>
    );
  }
}

class Output extends React.Component {
  state = {
    output: [...Array(25).keys()].reduce((s, i) => s + `Build or deploy result ${i} with a link: http://solana.com\n`, ''),
  }

  updateDimensions() {
    console.log('UPDATE Output DIMENSIONS');
    this.editor.layout();
  }

  editorDidMount(editor) {
    // eslint-disable-next-line no-console
    console.log('editorDidMount', editor, editor.getValue(), editor.getModel());
    this.editor = editor;
  }

  render() {
    const {output} = this.state;
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
      <ReactResizeDetector handleWidth handleHeight onResize={::this.updateDimensions}>
        <MonacoEditor
          language="shell"
          value={output + '\nfin'}
          options={options}
          editorDidMount={::this.editorDidMount}
        />
      </ReactResizeDetector>
    );
  }
}


class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: keygen_rs,
    };
  }

  updateDimensions() {
    console.log('UPDATE CodeEditor DIMENSIONS');
    this.editor.layout();
  }

  onChange(newValue, e) {
    console.log('onChange', newValue, e); // eslint-disable-line no-console
  }

  editorDidMount(editor) {
    // eslint-disable-next-line no-console
    console.log('editorDidMount', editor, editor.getValue(), editor.getModel());
    this.editor = editor;
  }

  /*
  changeEditorValue = () => {
    if (this.editor) {
      this.editor.setValue('// code changed! \n');
    }
  }

  changeBySetState = () => {
    this.setState({ code: '// code changed by setState! \n' });
  }
  */
  render() {
    const { code } = this.state;
    const options = {
      selectOnLineNumbers: true,
      readOnly: false,
      scrollBeyondLastLine: false,
    };
    return (
      <ReactResizeDetector handleWidth handleHeight onResize={::this.updateDimensions}>
        <MonacoEditor
          language="rust" // c
          value={code}
          options={options}
          onChange={::this.onChange}
          editorDidMount={::this.editorDidMount}
        />
      </ReactResizeDetector>
    );
  }
}

export class LeftPanel extends React.Component {
  state = {
    show: true,
  };

  onHide() {
    this.setState({show: false});
  }

  onShow() {
    this.setState({show: true});
  }

  render() {
    if (this.state.show) {
      const hidePanelTooltip = (
        <Tooltip id="hidePanelTooltip">Hide panel</Tooltip>
      );

      return (
        <div>
          <div style={{height: '50%', width:'330px', margin:'10px'}}>
            <FormGroup>
              <FormControl
                type="text"
                value=""
                placeholder="Untitled"
              />
              &nbsp;
              <FormControl style={{resize: 'none'}} componentClass="textarea" rows="3" placeholder="No description" />
              <br/>
              Language: &nbsp;
              <DropdownButton title="Rust">
                <MenuItem eventKey="1">Rust</MenuItem>
                <MenuItem eventKey="2">C</MenuItem>
              </DropdownButton>
            </FormGroup>
          </div>
          <div style={{height: '100px', float: 'right'}}>
            <OverlayTrigger placement="right" overlay={hidePanelTooltip}>
              <Glyphicon glyph="chevron-left"  bsSize="xsmall" onClick={::this.onHide} />
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
              <Glyphicon glyph="chevron-right"  bsSize="xsmall" onClick={::this.onShow} />
            </OverlayTrigger>
          </div>
        </div>
      );
    }
  }
}


export class Ide extends React.Component {
  render() {
    return (
      <div style={{height: '95%', width: '100%', display: 'flex', borderColor: 'red', borderWidth: '10', backgroundColor: '#f8f8f8'}}>
        <LeftPanel />
        <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
          <div style={{width: '0px'}}>
            <Navbar style={{marginBottom: '0', border: '0'}}>
              <Nav>
                <NavItem eventKey={1} onClick={() => alert('TOOD: Save program source on server, update URL to include saved program for sharing')}>
                  <Glyphicon glyph="cloud-upload" />
                  &nbsp; Save
                </NavItem>
                <NavItem eventKey={2} onClick={() => alert('TODO: Submit program to be built, report results in console.')}>
                  <Glyphicon glyph="play" />
                  &nbsp; Build
                </NavItem>
                <NavItem eventKey={3} onClick={() => alert('TODO: Deploy the program to the testnet')}>
                  <Glyphicon glyph="link" />
                  &nbsp; Deploy
                </NavItem>
              </Nav>
            </Navbar>
          </div>
          <div style={{height: '100%', width: '100%'}}>
            <CodeEditor />
          </div>
          <OutputHeader />
          <div style={{height: '200px', width: '100%'}}>
            <Output/>
          </div>
        </div>
      </div>
    );
  }
}
