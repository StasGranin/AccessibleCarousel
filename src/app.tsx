import React, {useEffect} from 'react';
import {render} from 'react-dom';

import Carousel, {CustomDotsComponentProps, SwipeEvent} from './Carousel';
import './app.scss';

type CarouselItemProps = {
	onActionHandler?: (fn: (any) => void) => void;
	onFocusHandler?: (fn: (any) => void) => void;
	itemNumber: number
};

const CarouselItem: React.FC<CarouselItemProps> = ({itemNumber, onActionHandler, onFocusHandler}) => {
	const onClick = () => {
		console.log(`Clicked item no. ${itemNumber}`);
	};

	const onFocus = () => {
		console.log(`Focused item no. ${itemNumber}`);
	};

	useEffect(() => {
		onActionHandler(onClick);
		onFocusHandler(onFocus);
	}, []);

	return (
		<div className="carouselTestItem" onClick={onClick} tabIndex={-1}>
			<div className="text">Carousel slide {itemNumber}</div>
			<img src={`https://picsum.photos/200?t=${new Date().getTime()}`} alt="random image"/>
		</div>
	)
};

const CustomDots: React.FC<CustomDotsComponentProps> = ({carouselSlides, focusedIndex, onAction}) => {
	return (<div className="customDots" onClick={() => onAction(focusedIndex+1, 'Dots')}>Press here to focus next item ({focusedIndex+1})</div>)
}

const onCarouselEvent = (eventType: string, event: FocusEvent|SwipeEvent) => {
	console.log(eventType, event);
}

const App = (
	<div>
		<button>Apple</button>
			<div className="carouselContainer">
			<Carousel
				aria-label="My awesome carousel"
				slidesToScroll={3}
				focusOnScroll={true}
				onSlideFocus={onCarouselEvent.bind(null, 'onSlideFocus')}
				onSwipe={onCarouselEvent.bind(null, 'onSwipe')}
				showArrows={true}
				showDots={true}
				/*dots={CustomDots}*/
				prevArrow={<div className="carouselArrow"/>}
				nextArrow={<div className="carouselArrow"/>}>
				<CarouselItem itemNumber={1} />
				<CarouselItem itemNumber={2} />
				<CarouselItem itemNumber={3} />
				<CarouselItem itemNumber={4} />
				<CarouselItem itemNumber={5} />
				<CarouselItem itemNumber={6} />
				<CarouselItem itemNumber={7} />
				<CarouselItem itemNumber={8} />
				<CarouselItem itemNumber={9} />
				<CarouselItem itemNumber={10} />
			</Carousel>
		</div>
		<button>Pear</button>
	</div>
);

render(
	App, document.getElementById('app')
);