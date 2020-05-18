import { configuration } from './configuration';
import { expect, use } from 'chai';
import SinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';

use(SinonChai);
use(chaiAsPromised);

describe('Configuration decorator test suite', () => {
    const config = {
        props: {
            atr1: 'abc',
            'sub-pros': {
                atr2: 123
            }
        }
    };

    beforeEach(() => {
        configuration.set(config);
    });

    it('should add attribute from the configuration', () => {
        const target: any = {};

        configuration('props.atr1')(target, 'name');

        expect(target.name).to.equal('abc');
    });

    it('should overwrite attribute from the configuration ', () => {
        const target: any = {
            value: 456
        };

        configuration('props.sub-pros.atr2')(target, 'value');

        expect(target.value).to.equal(123);
    });

    it('should stop traversing config if key is not found and return undefined', () => {
        const target: any = {};

        configuration('props.sub-pros.abc')(target, 'option');

        expect(target.option).to.be.undefined;
    });

    it('filled attribute should be read only', () => {
        const target: any = {};

        configuration('props.sub-pros.atr2')(target, 'value');
        expect(() => {
            target.value = 456;
        }).to.throw();

        expect(target.value).to.equal(123);
    });

    it('use entire config object when no key is passed', () => {
        const target: any = {};

        configuration()(target, 'value');

        expect(target.value).to.include(config);
    });
});
