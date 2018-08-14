import React from 'react';
import {
  Glyphicon,
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  FormControl,
  FormGroup,
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
      scrollBeyondLastLine: false,
    };
    return (
      <MonacoEditor
        border="1"
        width="100%"
        language="shell"
        value={output}
        options={options}
      />
    );
  }
}

//import {WalletApp} from './walletapp';
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
            <NavDropdown eventKey={4} title="Language" id="basic-nav-dropdown">
              <MenuItem eventKey={4.1} onClick={() => alert('TODO: Switch to Rust mode')}>Rust</MenuItem>
              <MenuItem eventKey={4.2} onClick={() => alert('TODO: Switch to C mode')}>C</MenuItem>
            </NavDropdown>
            <NavItem eventKey={5} onClick={() => alert('settings')}>
              &nbsp; Editor Settings
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
              <br/>
              <Link to="/wallet">Wallet</Link>
            </FormGroup>
          </div>
          <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
            <div style={{height: '80%', width: '100%'}}>
              <CodeEditor />
            </div>
            <div style={{height: '20%', width: '100%', borderColor: 'lightgrey', borderTopStyle: 'solid'}}>
              <Console />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
