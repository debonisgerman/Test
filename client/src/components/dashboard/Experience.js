import React, { Component } from "react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import Moment from "react-moment";
import { deleteExperience } from "../../actions/profileActions";

class Experience extends Component {
  onDeleteClick(id) {
    this.props.deleteExperience(id);
  }

  render() {
    const experience = this.props.experience.map(exp => (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          <Moment format="DD/MM/YYYY">{exp.from}</Moment> -{" "}
          {exp.to === null ? (
            "Ahora"
          ) : (
            <Moment format="DD/MM/YYYY">{exp.to}</Moment>
          )}
        </td>
        <td>
          <button
            onClick={this.onDeleteClick.bind(this, exp._id)}
            className="btn btn-danger"
          >
            Borrar
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Experiencias</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Puesto</th>
              <th>Años</th>
              <th />
            </tr>
          </thead>
          <tbody>{experience}</tbody>
        </table>
      </div>
    );
  }
}

Experience.propTypes = {
  deleteExperience: Proptypes.func.isRequired
};

export default connect(
  null,
  { deleteExperience }
)(Experience);
