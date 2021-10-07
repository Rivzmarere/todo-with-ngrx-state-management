import { EventEmitter, Directive, ElementRef, Inject, PLATFORM_ID, Input, Output, HostListener, NgModule } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * Generated from: src/ng2-tel-input.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const defaultUtilScript = 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.0.1/js/utils.js';
class Ng2TelInput {
    /**
     * @param {?} el
     * @param {?} platformId
     */
    constructor(el, platformId) {
        this.el = el;
        this.platformId = platformId;
        this.ng2TelInputOptions = {};
        this.hasError = new EventEmitter();
        this.ng2TelOutput = new EventEmitter();
        this.countryChange = new EventEmitter();
        this.intlTelInputObject = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.ng2TelInputOptions = Object.assign({}, this.ng2TelInputOptions, { utilsScript: this.getUtilsScript(this.ng2TelInputOptions) });
            this.ngTelInput = window.intlTelInput(this.el.nativeElement, Object.assign({}, this.ng2TelInputOptions));
            this.el.nativeElement.addEventListener("countrychange", (/**
             * @return {?}
             */
            () => {
                this.countryChange.emit(this.ngTelInput.getSelectedCountryData());
            }));
            this.intlTelInputObject.emit(this.ngTelInput);
        }
    }
    /**
     * @return {?}
     */
    onBlur() {
        /** @type {?} */
        let isInputValid = this.isInputValid();
        if (isInputValid) {
            /** @type {?} */
            let telOutput = this.ngTelInput.getNumber();
            this.hasError.emit(isInputValid);
            this.ng2TelOutput.emit(telOutput);
        }
        else {
            this.hasError.emit(isInputValid);
        }
    }
    /**
     * @return {?}
     */
    isInputValid() {
        return this.ngTelInput.isValidNumber();
    }
    /**
     * @param {?} country
     * @return {?}
     */
    setCountry(country) {
        this.ngTelInput.setCountry(country);
    }
    /**
     * @param {?} options
     * @return {?}
     */
    getUtilsScript(options) {
        return options.utilsScript || defaultUtilScript;
    }
}
Ng2TelInput.decorators = [
    { type: Directive, args: [{
                selector: '[ng2TelInput]',
            },] },
];
/** @nocollapse */
Ng2TelInput.ctorParameters = () => [
    { type: ElementRef },
    { type: String, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
];
Ng2TelInput.propDecorators = {
    ng2TelInputOptions: [{ type: Input, args: ['ng2TelInputOptions',] }],
    hasError: [{ type: Output, args: ['hasError',] }],
    ng2TelOutput: [{ type: Output, args: ['ng2TelOutput',] }],
    countryChange: [{ type: Output, args: ['countryChange',] }],
    intlTelInputObject: [{ type: Output, args: ['intlTelInputObject',] }],
    onBlur: [{ type: HostListener, args: ['blur',] }]
};

/**
 * @fileoverview added by tsickle
 * Generated from: src/ng2-tel-input.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Ng2TelInputModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: Ng2TelInputModule,
            providers: []
        };
    }
}
Ng2TelInputModule.decorators = [
    { type: NgModule, args: [{
                declarations: [Ng2TelInput],
                exports: [Ng2TelInput]
            },] },
];

export { Ng2TelInput, Ng2TelInputModule };
