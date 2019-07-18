import React from 'react';
import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
  Glyphicon,
  InputGroup,
  OverlayTrigger,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Well,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';
import * as bip39 from 'bip39';

const GENERATE_WALLET_MODE = 1;
const RECOVER_WALLET_MODE = 2;

export class Account extends React.Component {
  state = {
    walletMode: GENERATE_WALLET_MODE,
    revealSeedPhrase: false,
    generatedPhrase: bip39.generateMnemonic(),
    recoveredPhrase: '',
  };

  regenerateSeedPhrase() {
    const generatedPhrase = bip39.generateMnemonic();
    this.setState({generatedPhrase});
  }

  copyGeneratedPhrase() {
    copy(this.state.generatedPhrase);
  }

  createAccount() {
    this.props.store.createAccountFromSeed(this.state.generatedPhrase);
  }

  recoverAccount() {
    this.props.store.createAccountFromSeed(this.state.recoveredPhrase);
  }

  onModeChange(walletMode) {
    this.setState({walletMode});
  }

  onRecoverPhraseChange(e) {
    this.setState({recoveredPhrase: e.target.value});
  }

  validateRecoverPhrase() {
    if (this.state.recoveredPhrase) {
      if (bip39.validateMnemonic(this.state.recoveredPhrase)) {
        return 'success';
      } else {
        return 'error';
      }
    }
    return null;
  }

  render() {
    return (
      <Well>
        <h2>Account Setup</h2>
        <p>
          A locally cached wallet account was not found. Generate a new one or
          recover an existing wallet from its seed phrase.
        </p>
        <hr />
        <FormGroup>
          <ToggleButtonGroup
            name="options"
            value={this.state.walletMode}
            onChange={mode => this.onModeChange(mode)}
            justified
          >
            <ToggleButton value={GENERATE_WALLET_MODE}>
              Generate New Wallet
            </ToggleButton>
            <ToggleButton value={RECOVER_WALLET_MODE}>
              Recover Existing Wallet
            </ToggleButton>
          </ToggleButtonGroup>
        </FormGroup>
        {this.state.walletMode === GENERATE_WALLET_MODE &&
          this.renderGenerateWalletMode()}
        {this.state.walletMode === RECOVER_WALLET_MODE &&
          this.renderRecoverWalletMode()}
      </Well>
    );
  }

  seedPhraseInputType() {
    if (this.state.revealSeedPhrase) {
      return 'text';
    } else {
      return 'password';
    }
  }

  toggleReveal() {
    this.setState({revealSeedPhrase: !this.state.revealSeedPhrase});
  }

  renderRevealToggle() {
    let glyph = 'eye-close';
    let toggleText = 'Reveal';
    if (this.state.revealSeedPhrase) {
      glyph = 'eye-open';
      toggleText = 'Hide';
    }

    const revealTooltip = (
      <Tooltip id="reveal">{toggleText}</Tooltip>
    );

    return (
      <InputGroup.Button>
        <OverlayTrigger placement="bottom" overlay={revealTooltip}>
          <Button onClick={() => this.toggleReveal()}>
            <Glyphicon glyph={glyph} />
          </Button>
        </OverlayTrigger>
      </InputGroup.Button>
    );
  }

  renderRecoverWalletMode() {
    return (
      <React.Fragment>
        <FormGroup validationState={this.validateRecoverPhrase()}>
          <ControlLabel>
            Enter a valid seed phrase to recover a wallet
          </ControlLabel>
          <InputGroup>
            {this.renderRevealToggle()}
            <FormControl
              autoFocus="true"
              type={this.seedPhraseInputType()}
              autoComplete="current-password"
              value={this.state.recoveredPhrase}
              placeholder="Enter seed phrase"
              onChange={e => this.onRecoverPhraseChange(e)}
            />
          </InputGroup>
          <FormControl.Feedback />
          <HelpBlock>Seed phrase should be 12 words in length.</HelpBlock>
        </FormGroup>
        <hr />
        <Button bsStyle="primary" onClick={() => this.recoverAccount()}>
          Recover Account
        </Button>
      </React.Fragment>
    );
  }

  renderGenerateWalletMode() {
    const copyTooltip = (
      <Tooltip id="clipboard">Copy seed phrase to clipboard</Tooltip>
    );

    return (
      <React.Fragment>
        <FormGroup>
          <ControlLabel>Generated Seed Phrase</ControlLabel>
          <InputGroup>
            {this.renderRevealToggle()}
            <FormControl
              autoFocus="true"
              type={this.seedPhraseInputType()}
              autoComplete="new-password"
              size="21"
              value={this.state.generatedPhrase}
              onChange={() => {
                return false;
              }}
            />
            <InputGroup.Button>
              <OverlayTrigger placement="bottom" overlay={copyTooltip}>
                <Button onClick={() => this.copyGeneratedPhrase()}>
                  <Glyphicon glyph="copy" />
                </Button>
              </OverlayTrigger>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
        <hr />
        <p>
          <b>WARNING:</b> The seed phrase will not be shown again, copy it down
          or save in your password manager to recover this wallet in the future.
        </p>
        <Button bsStyle="primary" onClick={() => this.createAccount()}>
          Create Account
        </Button>
      </React.Fragment>
    );
  }
}

Account.propTypes = {
  store: PropTypes.object,
};
