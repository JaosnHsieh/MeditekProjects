var ComponentPageBar = require('modules/eform/eformTemplateDetail/pageBar');
var ComponentSection = require('modules/eform/eformTemplateDetail/section');
var EFormService = require('modules/eform/services');
var Config = require('config');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            name: 'New EForm',
            sections: Immutable.List()
        }
    },
    userUID: null,
    _loadPreview: function() {
        EFormService.eformTemplateDetail({ uid: this.props.params.templateUID })
            .then(function(response) {
                this.refs.pageBar.setName(response.data.Name);
                this.refs.pageBarBottom.setName(response.data.Name);
                var EFormTemplate = response.data;
                var content = JSON.parse(response.data.EFormTemplateData.TemplateData);
                this.setState(function(prevState) {
                    return {
                        name: EFormTemplate.Name,
                        sections: Immutable.fromJS(content)
                    }
                })
            }.bind(this))
    },
    componentDidMount: function() {
        this._loadPreview();
        var locationParams = Config.parseQueryString(window.location.href);
        this.refs.pageBar.setUserUID(this.props.params.userUID);
        this.refs.pageBarBottom.setUserUID(this.props.params.userUID);
    },
    _onComponentPageBarAddNewSection: function() {
        var sectionRef = "section_"+this.state.sections.size;
        this.setState(function(prevState) {
            return {
                sections: prevState.sections.push(Immutable.Map({ name: 'New Section', ref: sectionRef, rows: Immutable.List() }))
            }
        })
        swal("Success!", "Your section has been created.", "success");
    },
    _onComponentSectionUpdate: function(code, name) {
        this.setState(function(prevState) {
            return {
                sections: prevState.sections.updateIn([code, 'name'], val => name)
            }
        })
        swal("Updated!", "Your section " + name + " has been updated.", "success")
    },
    _onComponentSectionRemove: function(code) {
        this.setState(function(prevState) {
            return {
                sections: prevState.sections.delete(code)
            }
        })
        swal("Deleted!", "Your section has been deleted.", "success")
    },
    _onComponentSectionDrag: function(fromObj, toObj) {
        var fromImmutable = this.state.sections.get(fromObj.codeSection);
        var toImmutable = this.state.sections.get(toObj.codeSection);
        var sections = this.state.sections;
        sections = sections.updateIn([fromObj.codeSection], val => toImmutable);
        sections = sections.updateIn([toObj.codeSection], val => fromImmutable);
        this.setState(function(prevState) {
            return {
                sections: sections
            }
        })
        swal("Success!", "Drag change section successfully.", "success");
    },
    _onComponentSectionSelectField: function(codeSection, codeRow, typeField) {
        var fields = this.state.sections.get(codeSection).get('rows').get(codeRow).get('fields');
        var ref = "field_" + codeSection + '_' + codeRow + '_' +fields.size;
        if(Config.getPrefixField(typeField, 'eform_input') > -1){
            var object = { type: typeField, name: '', size: '12', ref: ref, preCal: ''};
            if(Config.getPrefixField(typeField, 'textarea') > -1)
                object.rows = 1;
            if(Config.getPrefixField(typeField, 'check') > -1){
                object.label = 'New Check';
                object.value = 'new_value';
            }
            if(Config.getPrefixField(typeField, 'label') > -1){
                delete object.name;
            }
            this.setState(function(prevState) {
                return {
                    sections: prevState.sections.updateIn([codeSection, 'rows', codeRow, 'fields'], val => val.push(
                        Immutable.Map(object)
                    ))
                }
            })
        }else if(typeField === 'table'){
            this.setState(function(prevState){
                return {
                    sections: prevState.sections.updateIn([codeSection,'rows',codeRow,'fields'], val => val.push(
                        Immutable.fromJS({
                            code: typeField,
                            type: typeField,
                            name: '',
                            size: '12',
                            ref: ref,
                            content: {
                                cols: [{label: 'Label Table', type: 'it'}],
                                rows: 1
                            }
                        })
                    ))
                }
            })
        }
        swal("Success!", "Add field successfully.", "success")
    },
    _onComponentSectionDragRow: function(fromObj, toObj) {
        var fromImmutable = this.state.sections.get(fromObj.codeSection).get('rows').get(fromObj.codeRow);
        var toImmutable = this.state.sections.get(toObj.codeSection).get('rows').get(toObj.codeRow);
        var sections = this.state.sections;
        sections = sections.updateIn([fromObj.codeSection, 'rows', fromObj.codeRow], val => toImmutable);
        sections = sections.updateIn([toObj.codeSection, 'rows', toObj.codeRow], val => fromImmutable);
         this.setState(function(prevState) {
            return {
                sections: sections
            }
        })
        swal("Success!", "Drag change field successfully.", "success");
    },
    _onComponentSectionRemoveField: function(codeSection, codeRow, codeField) {
        this.setState(function(prevState) {
            return {
                sections: prevState.sections.deleteIn([codeSection, 'rows', codeRow, 'fields', codeField])
            }
        })
        swal("Deleted!", "Delete field successfully.", "success");
    },
    _onComponentSectionSaveFieldDetail: function(codeSection, codeRow, dataField) {
        if(Config.getPrefixField(dataField.type, 'eform_input') > -1){
            this.setState(function(prevState) {
                if(Config.getPrefixField(dataField.type, 'textarea') > -1){
                    return {
                        sections: prevState.sections.updateIn([codeSection, 'rows', codeRow, 'fields', dataField.code], val =>
                            val.set('name', dataField.name)
                            .set('size', dataField.size)
                            .set('rows', dataField.rows)
                            .set('preCal', dataField.preCal)
                        )
                    }
                }else if(Config.getPrefixField(dataField.type, 'checkbox') > -1){
                    return {
                        sections: prevState.sections.updateIn([codeSection, 'rows', codeRow, 'fields', dataField.code], val =>
                            val.set('name', dataField.name)
                            .set('size', dataField.size)
                            .set('label', dataField.label)
                            .set('value', dataField.value)
                            .set('preCal', dataField.preCal)
                        )
                    }
                }else if(Config.getPrefixField(dataField.type, 'radio') > -1){
                    return {
                        sections: prevState.sections.updateIn([codeSection, 'rows', codeRow, 'fields', dataField.code], val =>
                            val.set('name', dataField.name)
                            .set('size', dataField.size)
                            .set('label', dataField.label)
                            .set('value', dataField.value)
                            .set('preCal', dataField.preCal)
                        )
                    }
                }else if(Config.getPrefixField(dataField.type, 'label') > -1){
                    return {
                        sections: prevState.sections.updateIn([codeSection, 'rows', codeRow, 'fields', dataField.code], val =>
                            val.set('size', dataField.size)
                            .set('label', dataField.label)
                            .set('value', dataField.value)
                        )
                    }
                }else{
                    return {
                        sections: prevState.sections.updateIn([codeSection, 'rows', codeRow, 'fields', dataField.code], val =>
                            val.set('name', dataField.name)
                            .set('size', dataField.size)
                            .set('preCal', dataField.preCal)
                        )
                    }
                }
            })
        }else if(dataField.type === 'table'){
            this.setState(function(prevState) {
                return {
                    sections: prevState.sections.updateIn([codeSection, 'rows', codeRow, 'fields', dataField.code], val =>
                        val.set('name', dataField.name)
                        .set('size', dataField.size)
                    )
                }
            })
        }else if(dataField.type === 'signature'){
            this.setState(function(prevState) {
                return {
                    sections: prevState.sections.updateIn([codeSection, 'rows', codeRow, 'fields', dataField.code], val =>
                        val.set('name', dataField.name)
                        .set('size', dataField.size)
                    )
                }
            })
        }
        swal("Success!", "Edit field successfully.", "success");
    },
    _onComponentSectionCreateTableRow: function(codeSection, codeRow, codeField) {
        this.setState(function(prevState) {
            return {
                sections: prevState.sections.updateIn([codeSection, 'rows', codeRow, 'fields', codeField, 'content', 'rows'], val => val + 1)
            }
        })
        swal("Success!", "Add row table successfully.", "success")
    },
    _onComponentSectionCreateTableColumn: function(codeSection, codeRow, codeField) {
        this.setState(function(prevState) {
            return {
                sections: prevState.sections.updateIn([codeSection, 'rows', codeRow, 'fields', codeField, 'content', 'cols'], val => val.push(
                    Immutable.Map({ label: 'Label Table', type: 'it' })
                ))
            }
        })
        swal("Success!", "Add column table successfully.", "success");
    },
    _onComponentSectionRemoveTableRow: function(codeSection, codeRow, codeField) {
        var row = this.state.sections.get(codeSection).get('rows').get(codeRow).get('fields').get(codeField).get('content').get('rows');
        if (row > 1) {
            this.setState(function(prevState) {
                return {
                    sections: prevState.sections.updateIn([codeSection, 'rows', codeRow, 'fields', codeField, 'content', 'rows'], val => val - 1)
                }
            })
            swal("Success!", "Delete row table successfully.", "success")
        } else
            swal("Warning!", "Must contain 1 row.", "warning")
    },
    _onComponentSectionRemoveTableColumn: function(codeSection, codeRow, codeField, codeColumn) {
        var columns = this.state.sections.get(codeSection).get('rows').get(codeRow).get('fields').get(codeField).get('content').get('cols')
        if (columns.size > 1) {
            this.setState(function(prevState) {
                return {
                    sections: prevState.sections.deleteIn([codeSection, 'rows', codeRow, 'fields', codeField, 'content', 'cols', codeColumn])
                }
            })
            swal("Success!", "Delete column table successfully.", "success")
        } else
            swal("Warning!", "Must contain 1 column.", "warning")
    },
    _onComponentSectionUpdateTableColumn: function(codeSection, codeRow, codeField, data) {
        this.setState(function(prevState) {
            return {
                sections: prevState.sections.updateIn([codeSection, 'rows', codeRow, 'fields', codeField, 'content', 'cols', data.code], val =>
                    val.set('label', data.label)
                    .set('type', data.type)
                )
            }
        })
        swal("Success!", "Update column table successfully.", "success")
    },
    _onComponentPageBarSaveForm: function() {
        var templateUID = this.props.params.templateUID;
        var content = this.state.sections.toJS();
        EFormService.eformTemplateSave({ uid: templateUID, content: JSON.stringify(content), userUID: this.props.userUID })
            .then(function(response) {
                swal("Success!", "Your form has been saved.", "success");
            }.bind(this))
    },
    _onComponentSectionCreateRow: function(codeSection){
        var rowRef = "row_"+codeSection+'_'+this.state.sections.get(codeSection).get('rows').size;
        this.setState(function(prevState) {
            return {
                sections: prevState.sections.updateIn([codeSection, 'rows'], val => val.push(Immutable.Map({ref: rowRef, type: 'row', fields: Immutable.List(), size: 12})))
            }
        })
        swal("Success!", "Your row has been created.", "success");
    },
    _onComponentSectionRemoveRow: function(codeSection, codeRow){
        this.setState(function(prevState) {
            return {
                sections: prevState.sections.deleteIn([codeSection, 'rows', codeRow])
            }
        })
        swal("Deleted!", "Your section has been deleted.", "success")
    },
    render: function(){
	return (
		<div className="page-content">
		      <ComponentPageBar ref="pageBar"
		          onAddNewSection={this._onComponentPageBarAddNewSection}
		          onSaveForm={this._onComponentPageBarSaveForm}/>
            		      <h3 className="page-title">{this.state.name}</h3>
                                {
                                    	this.state.sections.map(function(section, index){
                                    		return <ComponentSection key={index}
                                    			ref={section.get('ref')}
                                                                 refTemp={section.get('ref')}
                                    			key={index}
                                    			code={index}
                                                                 type="section"
                                                                 permission="eformDev"
                                                                 rows={section.get('rows')}
                                    			name={section.get('name')}
                                    			onUpdateSection={this._onComponentSectionUpdate}
                                    			onRemoveSection={this._onComponentSectionRemove}
                                    			onDragSection={this._onComponentSectionDrag}
                                                                 onCreateRow={this._onComponentSectionCreateRow}
                                                                 onRemoveRow={this._onComponentSectionRemoveRow}
                                    			onSelectField={this._onComponentSectionSelectField}
                                    			onDragField={this._onComponentSectionDragField}
                                    			onRemoveField={this._onComponentSectionRemoveField}
                                    			onSaveFieldDetail={this._onComponentSectionSaveFieldDetail}
                                    			onCreateTableRow={this._onComponentSectionCreateTableRow}
                                    			onRemoveTableRow={this._onComponentSectionRemoveTableRow}
                                    			onCreateTableColumn={this._onComponentSectionCreateTableColumn}
                                    			onRemoveTableColumn={this._onComponentSectionRemoveTableColumn}
                                    			onUpdateTableColumn={this._onComponentSectionUpdateTableColumn}
                                                                 onDragRow={this._onComponentSectionDragRow}/>
                                    	}, this)
                                }
                                <ComponentPageBar ref="pageBarBottom"
                                  onAddNewSection={this._onComponentPageBarAddNewSection}
                                  onSaveForm={this._onComponentPageBarSaveForm}/>
	           </div>
	)
    }
})