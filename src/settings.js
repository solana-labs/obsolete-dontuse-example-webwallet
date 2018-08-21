import React from 'react';
import {
  DropdownButton,
  MenuItem,
  FormControl,
  FormGroup,
  InputGroup,
  Panel,
} from 'react-bootstrap';

export class Settings extends React.Component {
  render() {
    return (
      <div>
        <p/>
        <Panel>
          <Panel.Heading>Network</Panel.Heading>
          <Panel.Body>
            <FormGroup>
              <InputGroup>
                <DropdownButton
                  componentClass={InputGroup.Button}
                  title="Network Entrypoint"
                >
                  <MenuItem key="1">http://localhost:8899</MenuItem>
                  <MenuItem key="2">http://testnet.solana.com:8899</MenuItem>
                  <MenuItem key="3">http://master.testnet.solana.com:8899</MenuItem>
                </DropdownButton>
                <FormControl
                  type="text"
                  value=""
                  placeholder="Enter the URI of the network"
                />
              </InputGroup>
            </FormGroup>
          </Panel.Body>
        </Panel>
        <p/>
        <Panel>
          <Panel.Heading>Account</Panel.Heading>
          <Panel.Body>
            <i>Keypair management...</i>
          </Panel.Body>
        </Panel>        <p/>
        <Panel>
          <Panel.Heading>Editor</Panel.Heading>
          <Panel.Body>
            <i>Editor settings...</i>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

