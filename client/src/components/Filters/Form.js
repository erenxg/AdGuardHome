import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
import flow from 'lodash/flow';

import {
    renderInputField, required, isValidPath, renderSelectField,
} from '../../helpers/form';
import { MODAL_OPEN_TIMEOUT, MODAL_TYPE } from '../../helpers/constants';

const getIconsData = (homepage, source) => ([
    {
        iconName: 'dashboard',
        href: homepage,
        className: 'ml-1',
    },
    {
        iconName: 'setup',
        href: source,
        className: '',
    },
]);

const renderIcons = (iconsData) => iconsData.map(({
    iconName,
    href,
    className = '',
}) => <a key={iconName} href={href}
         className={`${className} d-flex align-items-center`.trim()}>
    <svg className="nav-icon">
        <use xlinkHref={`#${iconName}`} />
    </svg>
</a>);

const renderFilters = ({ categories, filters }, selectedSources, t) => Object.values(categories)
    .map(({ name, filterIds }) => <div key={name} className="modal-body__item">
        <h6 className="form__label form__label--with-desc form__label--bold pb-2">{t('name')}</h6>
        {filterIds.map((filterId) => {
            const filter = filters[filterId];

            if (!filter) {
                return null;
            }

            const { homepage, source, name } = filter;

            const isSelected = Object.prototype.hasOwnProperty.call(selectedSources, source);

            const iconsData = getIconsData(homepage, source);

            return <div key={name} className="d-flex align-items-center">
                <Field
                    name={`filter${filterId}`}
                    type="checkbox"
                    component={renderSelectField}
                    placeholder={t(name)}
                    disabled={isSelected}
                />
                {renderIcons(iconsData)}
            </div>;
        })}
    </div>);

const Form = (props) => {
    const {
        t,
        closeModal,
        handleSubmit,
        processingAddFilter,
        processingConfigFilter,
        whitelist,
        modalType,
        toggleFilteringModal,
        selectedSources,
        filtersCatalog,
    } = props;

    const openModal = (modalType, timeout = MODAL_OPEN_TIMEOUT) => {
        toggleFilteringModal();
        setTimeout(() => toggleFilteringModal({ type: modalType }), timeout);
    };

    const openFilteringListModal = () => openModal(MODAL_TYPE.CHOOSE_FILTERING_LIST);

    const openAddFiltersModal = () => openModal(MODAL_TYPE.ADD_FILTERS);

    return <form onSubmit={handleSubmit}>
        <div className="modal-body modal-body--medium">
            {modalType === MODAL_TYPE.SELECT_MODAL_TYPE
            && <div className="d-flex justify-content-around">
                <button onClick={openFilteringListModal}
                        className="btn btn-success btn-standard mr-2 btn-large">
                    {t('choose_from_list')}
                </button>
                <button onClick={openAddFiltersModal} className="btn btn-primary btn-standard">
                    {t('add_custom_list')}
                </button>
            </div>}
            {modalType === MODAL_TYPE.CHOOSE_FILTERING_LIST
            && renderFilters(filtersCatalog, selectedSources, t)}
            {modalType !== MODAL_TYPE.CHOOSE_FILTERING_LIST
            && modalType !== MODAL_TYPE.SELECT_MODAL_TYPE
            && <>
                <div className="form__group">
                    <Field
                        id="name"
                        name="name"
                        type="text"
                        component={renderInputField}
                        className="form-control"
                        placeholder={t('enter_name_hint')}
                        validate={[required]}
                        normalizeOnBlur={(data) => data.trim()} />
                </div>
                <div className="form__group">
                    <Field
                        id="url"
                        name="url"
                        type="text"
                        component={renderInputField}
                        className="form-control"
                        placeholder={t('enter_url_or_path_hint')}
                        validate={[required, isValidPath]}
                        normalizeOnBlur={(data) => data.trim()} />
                </div>
                <div className="form__description">
                    {whitelist ? t('enter_valid_allowlist') : t('enter_valid_blocklist')}
                </div>
            </>}
        </div>
        <div className="modal-footer">
            <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
            >
                {t('cancel_btn')}
            </button>
            <button
                type="submit"
                className="btn btn-success"
                disabled={processingAddFilter || processingConfigFilter}
            >
                {t('save_btn')}
            </button>
        </div>
    </form>;
};

Form.propTypes = {
    t: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    processingAddFilter: PropTypes.bool.isRequired,
    processingConfigFilter: PropTypes.bool.isRequired,
    whitelist: PropTypes.bool,
    modalType: PropTypes.string.isRequired,
    toggleFilteringModal: PropTypes.func.isRequired,
    filtersCatalog: PropTypes.object,
    selectedSources: PropTypes.object,
};

export default flow([
    withTranslation(),
    reduxForm({
        form: 'filterForm',
    }),
])(Form);
