import { Directive, ElementRef, Inject, PLATFORM_ID, Input, Output, HostListener, EventEmitter, NgModule } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/** @type {?} */
var defaultUtilScript = 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.0.1/js/utils.js';
var Ng2TelInput = /** @class */ (function () {
    function Ng2TelInput(el, platformId) {
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
    Ng2TelInput.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (isPlatformBrowser(this.platformId)) {
            this.ng2TelInputOptions = __assign({}, this.ng2TelInputOptions, { utilsScript: this.getUtilsScript(this.ng2TelInputOptions) });
            this.ngTelInput = window.intlTelInput(this.el.nativeElement, __assign({}, this.ng2TelInputOptions));
            this.el.nativeElement.addEventListener("countrychange", (/**
             * @return {?}
             */
            function () {
                _this.countryChange.emit(_this.ngTelInput.getSelectedCountryData());
            }));
            this.intlTelInputObject.emit(this.ngTelInput);
        }
    };
    /**
     * @return {?}
     */
    Ng2TelInput.prototype.onBlur = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var isInputValid = this.isInputValid();
        if (isInputValid) {
            /** @type {?} */
            var telOutput = this.ngTelInput.getNumber();
            this.hasError.emit(isInputValid);
            this.ng2TelOutput.emit(telOutput);
        }
        else {
            this.hasError.emit(isInputValid);
        }
    };
    /**
     * @return {?}
     */
    Ng2TelInput.prototype.isInputValid = /**
     * @return {?}
     */
    function () {
        return this.ngTelInput.isValidNumber();
    };
    /**
     * @param {?} country
     * @return {?}
     */
    Ng2TelInput.prototype.setCountry = /**
     * @param {?} country
     * @return {?}
     */
    function (country) {
        this.ngTelInput.setCountry(country);
    };
    /**
     * @param {?} options
     * @return {?}
     */
    Ng2TelInput.prototype.getUtilsScript = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        return options.utilsScript || defaultUtilScript;
    };
    Ng2TelInput.decorators = [
        { type: Directive, args: [{
                    selector: '[ng2TelInput]',
                },] },
    ];
    /** @nocollapse */
    Ng2TelInput.ctorParameters = function () { return [
        { type: ElementRef },
        { type: String, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
    ]; };
    Ng2TelInput.propDecorators = {
        ng2TelInputOptions: [{ type: Input, args: ['ng2TelInputOptions',] }],
        hasError: [{ type: Output, args: ['hasError',] }],
        ng2TelOutput: [{ type: Output, args: ['ng2TelOutput',] }],
        countryChange: [{ type: Output, args: ['countryChange',] }],
        intlTelInputObject: [{ type: Output, args: ['intlTelInputObject',] }],
        onBlur: [{ type: HostListener, args: ['blur',] }]
    };
    return Ng2TelInput;
}());

/**
 * @fileoverview added by tsickle
 * Generated from: src/ng2-tel-input.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var Ng2TelInputModule = /** @class */ (function () {
    function Ng2TelInputModule() {
    }
    /**
     * @return {?}
     */
    Ng2TelInputModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: Ng2TelInputModule,
            providers: []
        };
    };
    Ng2TelInputModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [Ng2TelInput],
                    exports: [Ng2TelInput]
                },] },
    ];
    return Ng2TelInputModule;
}());

export { Ng2TelInput, Ng2TelInputModule };
