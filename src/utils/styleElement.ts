type Variants = {
	[key: string]: {
		[value: string]: string;
	};
};

interface Props {
	[key: string]: string;
}

const cn = (...cns: string[]) => {
	return cns.join(' ');
};

const variant = (base: string, variants: Variants) => {
	return function builder(props: Props): string {
		const classes: string[] = [];

		Object.entries(props).forEach(([key, value]) => {
			if (!(key in variants)) return console.warn('ga ketemu puh key nya', key);
			classes.push(variants[key][value]);
		});
		return cn(base, ...classes);
	};
};

export default variant;
