import { MDBBadge } from 'mdbreact';
import React, { Component } from 'react';
import * as data from "./data";
import DisplayRFtTime from './DisplayRFtTime';
const tierNames = data.TierNames;

class Recipe extends Component {
    render() {
        return (
            <React.Fragment>
                <tr>
                    <th key={"step" + this.props.step}>{this.props.step}</th>
                    <th key={"machine" + this.props.step}>{this.props.machine}</th>
                    <th key={"tier" + this.props.step}>
                        <select className="browser-default custom-select" value={this.props.tier}
                            onChange={(e) => this.props.onChangeTier(this.props.step, e.target.value)}>
                            {tierNames.map((tier) =>
                                <option key={"tier" + tier + this.props.step} value={tier}>{tier}</option>)}
                        </select>
                    </th>
                    <th key={"overclock" + this.props.step}>
                        <select className="browser-default custom-select" value={this.props.overclock}
                            onChange={(e) => this.props.onChange(this.props.step, e.target.value)}>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </th>

                    <DisplayRFtTime
                        key={"display" + this.props.step}
                        rft={this.props.rft}
                        rftoc={this.props.rftoc}
                        time={this.props.time}
                        timeoc={this.props.timeoc}
                        efficiency={this.props.efficiency}
                        efficiencyoc={this.props.efficiencyoc}
                        overclock={this.props.overclock}
                    />

                    <th key={"inputs" + this.props.step}>
                        {
                            this.props.inputs.map((n, index) => {
                                return (
                                    <div key={index}>
                                        <b>{n.quantity + n.unit}</b>
                                        {" " + n.name}
                                    </div>
                                )
                            })
                        }
                    </th>
                    <th key={"outputs" + this.props.step}>
                        {
                            this.props.outputs.map((o, index) => {
                                return (
                                    <div key={index}>
                                        <b>{o.quantity + o.unit}</b>
                                        {" " + o.name}
                                    </div>
                                )
                            })
                        }
                    </th>
                    <th key={"targetMachines" + this.props.step}>
                        {Number(this.props.targetMachines).toFixed(2)}
                    </th>
                    <th key={"targetInputs" + this.props.step}>
                        {
                            this.props.inputs.map((o, index) => {
                                return (
                                    <div key={index}>
                                        <b>{Number(o.quantity * this.props.targetMachines /
                                            (this.props.overclock === 'true' ? this.props.timeoc : this.props.time)
                                        ).toFixed(2) + o.unit}</b>
                                        {" " + o.name}
                                    </div>
                                )
                            })
                        }
                    </th>
                    <th key={"targetOutputs" + this.props.step}>
                        {
                            this.props.outputs.map((o, index) => {
                                return (
                                    <div key={index}>
                                        <b>{Number(o.quantity * this.props.targetMachines /
                                            (this.props.overclock === 'true' ? this.props.timeoc : this.props.time)
                                        ).toFixed(2) + o.unit}</b>
                                        {" " + o.name}
                                    </div>
                                )
                            })
                        }
                    </th>
                    <th key={"modify" + this.props.step}>
                        <MDBBadge
                            tag="a"
                            color="light"
                            size="sm"
                            className="m-sm-1"
                            onClick={() => this.props.onSwapUp(Number(this.props.step))}
                        >Up</MDBBadge>
                        <MDBBadge
                            tag="a"
                            color="light"
                            size="sm"
                            className="m-sm-1"
                            onClick={() => this.props.onSwapDown(Number(this.props.step))}
                        >Down</MDBBadge>
                        <MDBBadge
                            tag="a"
                            color="danger"
                            size="sm"
                            className="m-sm-1"
                            onClick={() => this.props.onDelete(Number(this.props.step))}
                        >Remove</MDBBadge>
                    </th>
                </tr>
            </React.Fragment>
        )
    }
}

export default Recipe