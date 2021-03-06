module.exports = React.createClass({
    propTypes: {
        label: React.PropTypes.string,
        size: React.PropTypes.any,
        code: React.PropTypes.number,
        groupId: React.PropTypes.string,
        type: React.PropTypes.string,
        context: React.PropTypes.string,
        onRightClickItem: React.PropTypes.func,
    },
    getDefaultProps: function(){
        return {
            type: 'default',
            size: '12'
        }
    },
    componentDidMount: function(){
        if(typeof this.refs.group !== 'undefined' && this.props.context !== 'none'){
            $(this.refs.group).contextmenu({
                target: '#'+this.props.context,
                before: function(e, element, target) {                    
                    e.preventDefault();
                    return true;
                },
                onItem: function(element, e) {
                    this.props.onRightClickItem(this.props.code, e, this.props.refTemp)
                }.bind(this)
            })
        }
    },
    getLabel: function(){
        return this.props.label;
    },
    getSize: function(){
        return this.props.size;
    },
    getValue: function(){
        return '';
    },
    getType: function(){
        return this.props.type;
    },
    getRoles: function(){
        return this.props.roles;
    },
    isSelected: false,
    setSelection: function(value) {
        this.isSelected = value;
    },
    getIsSelected: function() {
        return this.isSelected;
    },
    selection: function () {
        if(!this.isSelected)
        {
            this.isSelected = true;
            $(this.refs.label).addClass('eform-selection-field');
        } else {
            this.isSelected = false;
            $(this.refs.label).removeClass('eform-selection-field');
        }

    },
    render: function(){
        var type = this.props.type;
        var html = null;
        var labelStyle = {
            "white-space": "pre-wrap"
        }
        switch(type){
            case 'default':
                html = (
                    <label>Label nay</label>
                )
                break;
            case 'eform_input_check_label_html':
                html = (
                    <div className={"dragula col-md-"+this.props.size} ref="group">
                        <div className="form-group" id={this.props.groupId}>
                            <div className="col-md-12">
                                <span className="form-control-static"
                                    dangerouslySetInnerHTML={{__html: this.props.label}} ref="label" onDoubleClick = {this.selection} style = {labelStyle}/>
                            </div>
                        </div>

                    </div>
                )
                break;
            case 'eform_input_check_label':
                html = (
                    <div className={"dragula col-xs-"+this.props.size} ref="group">
                        <div className="form-group" id={this.props.groupId}>
                            <div className="col-xs-12">
                                <span className="form-control-static" ref="label"  onDoubleClick = {this.selection} style = {labelStyle}>
                                    {this.props.label}
                                </span>
                            </div>
                        </div>
                    </div>
                )
        }
        return html;
	}
})
