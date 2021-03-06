var history = ReactRouter.hashHistory;
var Config = require('config');
var Modal = require('common/modal');
var Dropdown = require('common/dropdown');

module.exports = React.createClass({
	propTypes: {
	   onSaveForm: React.PropTypes.func,
                onPrintForm: React.PropTypes.func
	},
            appointmentUID: null,
            patientUID: null,
            userUID: null,
            componentDidMount: function(){
                
            },
            showFinalizeForm: function(){
                $(this.refs.group_finalized).show()
            },
            initStatus: function(status){
                if(status === 'finalized')
                    $(this.refs.unfinalize).show()
                else
                    $(this.refs.finalize).show()
            },
            _onPrintForm: function(){
                this.props.onPrintForm();
            },
            _onSaveForm: function(){
                this.props.onSaveForm();
            },
            enableSaveButton: function(){
                $(this.refs.btnSave).attr('disabled', false)
            },
            disableSaveButton: function(){
                $(this.refs.btnSave).attr('disabled', true)
            },
        	render: function(){
        	   return (
                   <div className="page-bar" style={{position: 'fixed', top: 0, right: 0}}>
                        <div className="page-toolbar">
                            <div className="pull-right">
        		      <button ref="btnSave" type="button" className="btn green btn-sm" onClick={this._onSaveForm}>
                                    <i className="fa fa-save"></i>&nbsp;
                                    Save Form
        		      </button>
                                &nbsp;
                                <span ref="group_finalized" style={{display: 'none'}}>
                                    <button type="button" className="btn green btn-sm" onClick={this.props.onFinalizeForm} style={{display: 'none'}} ref="finalize">
                                        <i className="fa fa-save"></i>&nbsp;
                                        Finalize Form
                                    </button>
                                    <button type="button" className="btn green btn-sm" onClick={this.props.onUnfinalizeForm} style={{display: 'none'}} ref="unfinalize">
                                        <i className="fa fa-save"></i>&nbsp;
                                        Unfinalize Form
                                    </button>
                                </span>
                                &nbsp;
                                <button type="button" className="btn green btn-sm" onClick={this._onPrintForm}>
                                    <i className="fa fa-print"></i>&nbsp;
                                    Print PDF Form
                                </button>
                            </div>
                        </div>
                    </div>
	   )
            }
})