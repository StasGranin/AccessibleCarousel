import React, {useEffect} from 'react';
import {render} from 'react-dom';

import Carousel, {CarouselEvent, CustomDotsComponentProps} from './Carousel';
import './app.scss';

type CarouselItemProps = {
	onSelectHandler?: (fn: (any) => void) => void;
	itemNumber: number
};

const CarouselItem: React.FC<CarouselItemProps> = ({itemNumber, onSelectHandler}) => {
	const onClick = () => {
		console.log(`Clicked item no. ${itemNumber}`);
	};

	useEffect(() => {
		onSelectHandler(onClick);
	}, []);

	return (
		<div className="carouselTestItem" onClick={onClick} tabIndex={-1}>Test Slide {itemNumber}</div>
	)
};

const CustomDots: React.FC<CustomDotsComponentProps> = ({carouselSlides, focusedIndex, onAction}) => {
	return (<div className="customDots" onClick={() => onAction(focusedIndex+1, 'Dots')}>Press here to focus next item ({focusedIndex+1})</div>)
}

const onSlideFocus = (event: CarouselEvent) => {
	console.log('onSlideFocus', event);
}

const App = (
	<div>
		<button>Apple</button>
			<div className="carouselContainer">
			<Carousel
				slidesToScroll={3}
				focusOnScroll={true}
				onSlideFocus={onSlideFocus}
				showArrows={true}
				showDots={true}
				/*dots={CustomDots}*/
				prevArrow={<div className="carouselArrow">&lt;</div>}
				nextArrow={<div className="carouselArrow">&gt;</div>}>
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