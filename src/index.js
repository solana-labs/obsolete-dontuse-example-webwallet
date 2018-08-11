import React from 'react';
import ReactDOM from 'react-dom';
import {
  Alert,
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  Glyphicon,
  InputGroup,
  Modal,
  OverlayTrigger,
  Panel,
  ProgressBar,
  Tooltip,
  Well,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';

import {Web3Sol} from './web3-sol';

class PublicKeyInput extends React.Component {
  state = {
    value: '',
    validationState: null,
  };

  getValidationState(value) {
    const length = value.length;
    if (length === 44) {
      if (value.match(/^[A-Za-z0-9]+$/)) {
        return 'success';
      }
      return 'error';
    } else if (length > 44) {
      return 'error';
    } else if (length > 0) {
      return 'warning';
    }
    return null;
  }

  handleChange(e) {
    const {value} = e.target;
    const validationState = this.getValidationState(value);
    this.setState({value, validationState});
    this.props.onPublicKey(validationState === 'success' ? value : null);
  }

  render() {
    return (
      <form>
        <FormGroup
          validationState={this.state.validationState}
        >
          <ControlLabel>Recipient&apos;s Public Key</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="Enter the public key of the recipient"
            onChange={(e) => this.handleChange(e)}
          />
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}
PublicKeyInput.propTypes = {
  onPublicKey: PropTypes.function,
};


class TokenInput extends React.Component {
  state = {
    value: '',
    validationState: null,
  };

  getValidationState(value) {
    if (value.length === 0) {
      return null;
    }
    if (value.match(/^\d+$/)) {
      return 'success';
    }
    return 'error';
  }

  handleChange(e) {
    const {value} = e.target;
    const validationState = this.getValidationState(value);
    this.setState({value, validationState});
    this.props.onAmount(validationState === 'success' ? value : null);
  }

  render() {
    return (
      <form>
        <FormGroup
          validationState={this.state.validationState}
        >
          <ControlLabel>Amount</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="Enter amount to transfer"
            onChange={(e) => this.handleChange(e)}
          />
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}
TokenInput.propTypes = {
  onAmount: PropTypes.function,
};


class DismissibleErrors extends React.Component {
  render() {
    const errs = this.props.errors.map((err, index) => {
      return <Alert key={index} bsStyle="danger">
        <a href="#" onClick={() => this.props.onDismiss(index)}><Glyphicon glyph="remove-sign" /></a> &nbsp;
        {err}
      </Alert>;
    });
    return (
      <div>
        {errs}
      </div>
    );
  }
}
DismissibleErrors.propTypes = {
  errors: PropTypes.array,
  onDismiss: PropTypes.function,
};


class BusyModal extends React.Component {
  render() {
    return (
      <Modal
        {...this.props}
        bsSize="small"
        aria-labelledby="contained-modal-title-sm"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-sm">{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.text}
          <br/>
          <br/>
          <ProgressBar active now={100} />
        </Modal.Body>
      </Modal>
    );
  }
}
BusyModal.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
};


class App extends React.Component {
  state = {
    web3sol: new Web3Sol('master.testnet.solana.com'), // TODO: make endpoint configurable by the user
    errors: [],
    busyModal: null,
    publicKey: '',
    balance: 0,
    recipientPublicKey: null,
    recipientAmount: null,
  };

  setRecipientPublicKey(recipientPublicKey) {
    this.setState({recipientPublicKey});
  }

  setRecipientAmount(recipientAmount) {
    this.setState({recipientAmount});
  }

  dismissError(index) {
    const {errors} = this.state;
    errors.splice(index, 1);
    this.setState({errors});
  }

  addError(message) {
    const {errors} = this.state;
    errors.push(message);
    this.setState({errors});
  }

  async runModal(title, text, f) {
    this.setState({
      busyModal: {title, text},
    });

    try {
      await f();
    } catch (err) {
      this.addError(err.message);
    }

    this.setState({busyModal: null});
  }

  componentDidMount() {
    this.runModal(
      'Initializing...',
      'Please wait...',
      async () => {
        const {web3sol} = this.state;
        this.setState({
          publicKey: await web3sol.getPublicKey(),
          balance: await web3sol.getBalance(),
        });
      }
    );
  }

  copyPublicKey() {
    copy(this.state.publicKey);
  }

  refreshBalance() {
    this.runModal(
      'Updating Account Balance',
      'Please wait...',
      async () => {
        const {web3sol} = this.state;
        this.setState({
          balance: await web3sol.getBalance(),
        });
      }
    );
  }

  requestAirdrop() {
    this.runModal(
      'Requesting Airdrop',
      'Please wait...',
      async () => {
        const {web3sol} = this.state;
        await web3sol.requestAirdrop(1000);
        this.setState({
          balance: await web3sol.getBalance(),
        });
      }
    );
  }

  sendTransaction() {
    this.runModal(
      'Sending Transaction',
      'Please wait...',
      async () => {
        const {web3sol} = this.state;
        await web3sol.sendTokens(
          this.state.recipientPublicKey,
          this.state.recipientAmount
        );
        this.setState({
          balance: await web3sol.getBalance(),
        });
      }
    );
  }

  render() {
    const copyTooltip = (
      <Tooltip id="clipboard">
        Copy public key to clipboard
      </Tooltip>
    );
    const refreshBalanceTooltip = (
      <Tooltip id="refresh">
        Refresh account balance
      </Tooltip>
    );
    const airdropTooltip = (
      <Tooltip id="airdrop">
        Request an airdrop
      </Tooltip>
    );

    const busyModal = this.state.busyModal ?
      <BusyModal show title={this.state.busyModal.title} text={this.state.busyModal.text} /> : null;

    const sendDisabled = this.state.recipientPublicKey === null || this.state.recipientAmount === null;
    const airdropDisabled = this.state.balance !== 0;
    return (
      <div>
        {busyModal}
        <DismissibleErrors errors={this.state.errors} onDismiss={(index) => this.dismissError(index)}/>
        <Well>
          Account Public Key:
          <FormGroup>
            <InputGroup>
              <FormControl readOnly type="text" size="21" value={this.state.publicKey}/>
              <InputGroup.Button>
                <OverlayTrigger placement="bottom" overlay={copyTooltip}>
                  <Button onClick={() => this.copyPublicKey()}>
                    <Glyphicon glyph="copy" />
                  </Button>
                </OverlayTrigger>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
          <p/>
          Account Balance: {this.state.balance} &nbsp;
          <OverlayTrigger placement="top" overlay={refreshBalanceTooltip}>
            <Button onClick={() => this.refreshBalance()}>
              <Glyphicon glyph="refresh" />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={airdropTooltip}>
            <Button disabled={airdropDisabled} onClick={() => this.requestAirdrop()}>
              <Glyphicon glyph="send" />
            </Button>
          </OverlayTrigger>
        </Well>
        <p/>
        <p/>
        <Panel>
          <Panel.Heading>Send Tokens</Panel.Heading>
          <Panel.Body>
            <PublicKeyInput onPublicKey={(publicKey) => this.setRecipientPublicKey(publicKey)}/>
            <TokenInput onAmount={(amount) => this.setRecipientAmount(amount)}/>
            <div className="text-center">
              <Button disabled={sendDisabled} onClick={() => this.sendTransaction()}>Send</Button>
            </div>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);

module.hot.accept();
