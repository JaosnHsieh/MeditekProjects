module.exports = React.createClass({
    value: '',
    propTypes: {
        name: React.PropTypes.string,
        size: React.PropTypes.any,
        groupId: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        code: React.PropTypes.number,
        type: React.PropTypes.string,
        context: React.PropTypes.string,
        refTemp: React.PropTypes.string,
        onRightClickItem: React.PropTypes.func,
        permission: React.PropTypes.string,
        preCal: React.PropTypes.string,
        labelPrefix: React.PropTypes.string,
        labelSuffix: React.PropTypes.string
    },
    getDefaultProps: function(){
        return {
            placeholder: '',
            type: 'default',
            name: '',
            className: 'form-control',
            size: '12'
        }
    },
    componentDidMount: function(){
        var self = this;
        if(typeof this.refs.group !== 'undefined' && this.props.context !== 'none'){
            $(this.refs.group).contextmenu({
                target: '#'+this.props.context,
                before: function(e, element, target) {
                    e.preventDefault();
                    return true;
                },
                onItem: function(element, e) {
                    this.props.onRightClickItem(this.props.code, e, this.props.refTemp);
                }.bind(this)
            })
        }
        if(this.props.permission === 'eformDev'){
            $(this.refs.input).prop('disabled', true);
        }
        if(typeof this.props.defaultValue !== 'undefined'){
            $(this.refs.input).val(this.props.defaultValue);
        }
        $(this.refs.input).on('change', function(event){
            if(typeof self.props.onChange !== 'undefined'){
                self.props.onChange();
            }
        })
		$(this.refs.input).on('keypress',function(event){
            if(typeof self.props.onKeyPress !== 'undefined'){
                self.props.onKeyPress(event);
            }
        })
    },
    componentWillReceiveProps: function(nextProps){
        $(this.refs.input).val(nextProps.defaultValue);
    },
    bmi: function(calRes){
        var self = this;
        $(this.refs.input).on('change', function(event){
            var width = $('#'+calRes[0]).val();
            var height = $('#'+calRes[1]).val()/100;

            if(width  && height){
                var bmi_cal = (width/Math.pow(height, 2)).toFixed(1);
                var calResArray = calRes[4].split('-');
                var res = parseFloat(calResArray[0]);
                calResArray.map(function(calStr, cal_index){
                    var cal = parseFloat(calStr);
                    if(cal <= bmi_cal)
                        res = cal;
                })
                var radios = $('input[name='+calRes[2]+']');
                radios.filter(function(){
                    var id = $(this).attr('id');
                    var id_value = $('#'+id).val();

                    if(parseFloat(res) === parseFloat(id_value)){
                        $('#'+id).iCheck('check');
                    }else{
                        $('#'+id).iCheck('uncheck');
                    }
                })
                var inputs = $("input[name="+calRes[3]+"]");
                if(inputs.length>0) {
                    $(inputs[0]).val(bmi_cal);
                }
                
            } else {
                var radios = $('input[name='+calRes[2]+']');
                radios.filter(function(){
                    var id = $(this).attr('id');
                    $('#'+id).iCheck('uncheck');
                });
                var inputs = $("input[name="+calRes[3]+"]");
                if(inputs.length>0) {
                    $(inputs[0]).val(null);
                }
            }
        })
    },
    // cal expression: WHR(field_1_0_5,field_1_0_7,whr_class,whr,0-0.85-0.96,0-0.75-0.86,gender)
    whr: function(calRes) {
        var self = this;
        $(this.refs.input).on('change', function (event) {
            var radioGender = $("input[name="+calRes[6]+"]:checked");
            var gender = null;
            if(radioGender.length>0) {
                gender = radioGender.val();
            }
            console.log("WHR ->>>>>>>>>>>> Gender:", gender);
            var waist = $('#' + calRes[0]).val();
            var hip = $('#' + calRes[1]).val();
            if(waist && hip) {
                var whr_value = (waist/hip).toFixed(2);
                var calExpArr = [];
                if (gender == 'Male')
                    calExpArr = calRes[4].split('-');
                else
                    calExpArr = calRes[5].split('-');
                var res = parseFloat(calExpArr[0]);
                calExpArr.map(function(expStr, expIndex){
                    var exp = parseFloat(expStr);
                    if(whr_value >= exp)
                    {
                        res = exp;
                    }
                });
                var radios = $("input[name=" + calRes[2] + "]");
                radios.filter(function(){
                    var id = $(this).attr('id');
                    var radioValueStr = $('#'+id).val();
                    var radioValueArr = radioValueStr.split('-');
                    var radioValue = null;
                    if (gender == 'Male')
                        radioValue = radioValueArr[0];
                    else
                        radioValue = radioValueArr[1];
                    if (res === parseFloat(radioValue))
                        $('#' + id).iCheck('check');
                    else
                        $('#' + id).iCheck('uncheck');
                    var inputs = $('input[name=' + calRes[3] + ']');
                    if(inputs.length > 0) {
                        $(inputs[0]).val(whr_value);
                    }

                })

            } else {
                var radios = $("input[name=" + calRes[2] + "]");
                radios.filter(function(){
                    var id = $(this).attr('id');
                    $('#' + id).iCheck('uncheck');
                });
                var inputs = $('input[name=' + calRes[3] + ']');
                if(inputs.length > 0) {
                    $(inputs[0]).val(null);
                }
            }

        })
    },
    maxHR: function (calRes) {
        var self = this;
        $(this.refs.input).on('change', function (event){
            var ageElement = $('input[name='+calRes[0]+']');
            var age = null;
            if( ageElement.length > 0 && Number.isInteger(parseInt($(ageElement[0]).val())) )
            {
                age = parseInt($(ageElement[0]).val());
                $(self.refs.input).val(220-age);
            } else {
                $(self.refs.input).val(null);
            }
        });

    },
    maxHR85: function (calRes) {
        var self = this;
        $(this.refs.input).on('change', function (event){
            var ageElement = $('input[name='+calRes[0]+']');
            var age = null;
            console.log("maxhr85 ageelement:", ageElement);
            if(ageElement.length > 0 && Number.isInteger(parseInt($(ageElement[0]).val()))) {
                age = parseInt($(ageElement[0]).val());
                $(self.refs.input).val( ((220-age)*85/100 ).toFixed(1));
            } else {
                $(self.refs.input).val(null);
            }
        });
    },
    avg: function(calRes) {
        var self = this;
        $(this.refs.input).on('change', function(event) {
            var values = [];
            calRes.map(function(expStr, expIndex) {
                var items = $('input[name='+expStr+']');
                var item = null;
                if(items[0])
                {
                    item = items[0];
                    var value = parseFloat($(item).val());
                    if (!isNaN(value)){
                        values.push(value);
                    }
                }
            })

            if (values.length > 0) {
                var sum = 0;
                values.map(function(value){
                    sum = sum + value;
                })
                var avg = sum/values.length;
                $(self.refs.input).val(avg.toFixed(1));
            }
        })
    },
    triggerChange: function(calRes) {
        $(this.refs.input).on('change', function(event){
            calRes.map(function(expStr, index){
                var element = $('#'+expStr)[0];
                if(element)
                {
                    if ("createEvent" in document) {
                        var evt = document.createEvent("HTMLEvents");
                        evt.initEvent("change", false, true);
                        element.dispatchEvent(evt);
                    } else {
                        element.fireEvent("onchange");
                    }
                }
            })
        })
    },

    onSum: function(sumRef){
        var self = this;
        $(this.refs.input).on('change', function(event){
            var sumValue = $('#'+sumRef).val() || 0;
            self.value = $.isNumeric(self.value)?self.value:0;
            if($.isNumeric(event.target.value)){
                if(parseFloat(sumValue) >= parseFloat(self.value))
                    sumValue = parseFloat(sumValue)-parseFloat(self.value)+parseFloat(event.target.value);
            }else{
                sumValue = parseFloat(sumValue)-parseFloat(self.value);
            }
            $('#'+sumRef).val(sumValue).change();
            if(typeof self.props.onChange !== 'undefined'){
                self.props.onChange();
            }
            self.value = event.target.value;
        })
    },
    onBelongsGroup: function(group){
        var self = this;
        $('input[name='+group+']').on('ifClicked', function(event){
            var value = event.target.value;
            if(isNaN(value))
                value = 0;
            $(self.refs.input).val(parseInt(value)).change();
        })
    },
    setValue: function(value){
        if(value){            
            self.value = value;
            $(this.refs.input).val(value).change();
        }
    },

    setDisplay: function(type){
        if(type === 'disable'){
            $(this.refs.input).attr('disabled', true);
        }else{
            $(this.refs.input).css('display', 'none');
        }
    },
    getValue: function(){
        return $(this.refs.input).val()
    },
    getName: function(){
        return this.props.name;
    },
    getSize: function(){
        return this.props.size;
    },
    getType: function(){
        return this.props.type;
    },
    getCode: function(){
        return this.props.code;
    },
    getPreCal: function(){
        return this.props.preCal;
    },
    getCal: function(){
        return this.props.cal;
    },
    getRoles: function(){
        return this.props.roles;
    },
    getLabelPrefix: function() {
        return this.props.labelPrefix;
    },
    getLabelSuffix: function() {
        return this.props.labelSuffix;
    },
    isSelected: false,
    getIsSelected: function() {
        return this.isSelected;
    },
    selection: function () {
        if(!this.isSelected)
        {
            this.isSelected = true;
            $(this.refs.input).addClass('eform-selection-field');
        } else {
            this.isSelected = false;
            $(this.refs.input).removeClass('eform-selection-field');
        }

    },
    render: function(){
        var type = this.props.type;
        var html = null;
        var display_name = null;
        if(this.props.permission === 'eformDev'){
            display_name = (
                <div style={{position: 'absolute', top: -30, left: 0, backgroundColor: 'green', color: 'white', padding: 5}}>
                    {this.props.name}
                </div>
            )
        }
        var labelPrefixStyle = {
            border: 'none',
            color: '#666',
            paddingLeft: '1px',
            paddingRight:'5px'
        }
        var labelSuffixStyle = {
            border: 'none',
            color: '#666',
            paddingLeft: '5px',
            paddingRight:'1px'
        }
        var inputStyle = {
            paddingLeft: '1px',
            paddingRight:'1px'
        }
        switch(type){
            case 'default':
                html = (
                    <input type="text" name={this.props.name} className={this.props.className} ref="input" placeholder={this.props.placeholder}
                        defaultValue={this.props.defaultValue} style={this.props.style}
                        onBlur={this.props.onBlur} onChange={this.props.onChange}/>
                )
                break;
            case 'it':
                html = (
                    <input type="text" name={this.props.name} className="form-control" ref="input"/>
                )
                break;
            {/*case 'eform_input_text':
                html = (
                    <div className={"dragField col-xs-"+this.props.size} ref="group">
                        {display_name}
                        <div className="form-group" id={this.props.groupId}>
                            <div className="col-xs-12">
                                <input type="text" className={this.props.className} ref="input" placeholder={this.props.placeholder}/>
                            </div>
                        </div>
                    </div>
                )*/}
            case 'eform_input_text':
                html = (
                    <div className={"dragField col-xs-"+this.props.size} ref="group">
                        {display_name}
                        <div className="form-group" id={this.props.groupId}>
                            <div className="col-xs-12">
                                {
                                    this.props.labelPrefix || this.props.labelSuffix?
                                    <div className="input-group">
                                        {this.props.labelPrefix?
                                            <span className="input-group-addon" style={labelPrefixStyle}>{this.props.labelPrefix}</span>
                                            :null
                                        }

                                        <input type="text" name={this.props.name} className={this.props.className} style={inputStyle} ref="input" placeholder={this.props.placeholder} id={this.props.refTemp} onDoubleClick = {this.selection}/>
                                        {this.props.labelSuffix?
                                            <span className="input-group-addon" style={labelSuffixStyle}>{this.props.labelSuffix}</span>
                                            :null
                                        }

                                    </div>
                                    :<input type="text" name={this.props.name} className={this.props.className} style={inputStyle} ref="input" placeholder={this.props.placeholder} id={this.props.refTemp} onDoubleClick = {this.selection}/>
                                }

                            </div>
                        </div>
                    </div>
                )
        }
        return html;
	}
})
