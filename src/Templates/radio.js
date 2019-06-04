import React from 'react'
import {FormGroup, Input, Label} from 'reactstrap'

export default class Radio extends React.Component {
    render() {
        return (
            <FormGroup check>
                <Label check>
                    <Input type="radio" name={this.props.name} onClick={() => this.props.onClick()}/>
                    {this.props.text}
                </Label>
            </FormGroup>
        )
    }
} 