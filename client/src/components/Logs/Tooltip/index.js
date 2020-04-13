import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import './ReactTooltip.css';

const Tooltip = ({ id, children }) => (
    <ReactTooltip
        id={id}
        aria-haspopup="true"
        effect="solid"
        place="right"
        className="custom-tooltip"
        backgroundColor="#fff"
        arrowColor="transparent"
        textColor="#4d4d4d"
        delayHide={300}
    >
        {children}
    </ReactTooltip>
);

Tooltip.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default Tooltip;