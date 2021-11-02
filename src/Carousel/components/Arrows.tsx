import React from "react";
import {ArrowProps} from "../types";

const Arrow: React.FC<ArrowProps> = ({direction, settings, onAction}) => {
	const component = direction === 'back' ? settings.prevArrow : settings.nextArrow;

	if (settings.showArrows && component){
		return React.cloneElement(component, {
			className: `carouselButton ${direction} ${component.props.className}`,
			onMouseDown: (event) => onAction(event, direction === 'back' ? -settings.slidesToScroll : settings.slidesToScroll),
			tabIndex: -1
		});
	}

	return (<></>);
};



export default Arrow;