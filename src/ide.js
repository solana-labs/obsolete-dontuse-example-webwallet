import React from 'react';
import {
  Glyphicon,
  Navbar,
  Nav,
  NavItem,
  MenuItem,
  FormControl,
  FormGroup,
  DropdownButton,
} from 'react-bootstrap';
import MonacoEditor from 'react-monaco-editor';
import {Link} from 'react-router-dom';

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


class Console extends React.Component {
  state = {
    output: [...Array(25).keys()].reduce((s, i) => s + `Build or deploy result ${i} with a link: http://solana.com\n`, ''),
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
    };
    return (
      <MonacoEditor
        language="shell"
        value={output + '\nfin'}
        options={options}
      />
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

  onChange = (newValue, e) => {
    console.log('onChange', newValue, e); // eslint-disable-line no-console
  }

  editorDidMount = (editor) => {
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
      <MonacoEditor
        language="rust" // c
        value={code}
        options={options}
        onChange={this.onChange}
        editorDidMount={this.editorDidMount}
      />
    );
  }
}

export class Ide extends React.Component {
  render() {
    return (
      <div style={{height: '100%'}}>
        <Navbar staticTop style={{marginBottom: '0', border: '0'}}>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Solana Program Editor</a>
            </Navbar.Brand>
          </Navbar.Header>
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
          <Nav pullRight>
            <NavItem eventKey={5} onClick={() => alert('settings')}>
              Editor Settings
            </NavItem>
            <NavItem eventKey={6}>
              <Link to="/wallet">Wallet</Link>
            </NavItem>
          </Nav>
        </Navbar>
        <div style={{height: '100%', display: 'flex', backgroundColor: '#f8f8f8'}}>
          <div style={{height: '100%', width:'350px', margin:'10px'}}>
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
          <div style={{height: '100%', width: '100%'}}>
            <div style={{height: 'calc(100% - 200px)', width: '100%'}}>
              <CodeEditor />
            </div>
            <div style={{height: '200px', width: '100%'}}>
              <div style={{display: 'inline-block', width: '100%', paddingTop: '5px'}}>
                <div style={{float: 'left', paddingLeft: '10px'}}>
                  <b>Build Output</b>
                </div>
                <div style={{float: 'right', paddingRight: '10px'}}>
                  <Glyphicon glyph="remove" onClick={() => alert('TODO: Close build output pane')}/>
                </div>
              </div>
              <Console />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
