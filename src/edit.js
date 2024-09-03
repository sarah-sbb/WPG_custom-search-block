/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();

    const [parentCategories, setParentCategories] = useState([]);
    const [childCategories, setChildCategories] = useState([]);

    // Fetch parent categories on component mount
    useEffect(() => {
        apiFetch({ path: '/wp/v2/categories?parent=0&per_page=100' }).then((categories) => {
            const parents = categories.map((category) => ({
                label: category.name,
                value: category.id
            }));
            setParentCategories(parents);
        });
    }, []);

    // Fetch child categories when a parent is selected
    useEffect(() => {
        if (attributes.selectedParent) {
            apiFetch({ path: `/wp/v2/categories?parent=${attributes.selectedParent}` }).then((subCategories) => {
                const children = subCategories.map((subcategory) => ({
                    label: subcategory.name,
                    value: subcategory.id
                }));
                setAttributes({ childCategories: children });
            });
        } else {
            setAttributes({ childCategories: [] });
        }
    }, [attributes.selectedParent]);

    const handleParentChange = (value) => {
        setAttributes({ selectedParent: value });
        // Clear child categories if no parent is selected
        if (!value) {
            setAttributes({ childCategories: [] });
        }
    };

    const handleChildChange = (value) => {
        setAttributes({ selectedChild: value });
    };

    // Get the label of the selected parent category to use as a placeholder
    const selectedParentLabel = parentCategories.find(cat => cat.value === attributes.selectedParent)?.label || 'Type de structure';

    return (
        <div { ...blockProps }>
            <InspectorControls>
                <PanelBody title={__('Block Settings', 'custom-search-block')}>
                    <SelectControl
                        label={__('Type de structure', 'custom-search-block')}
                        value={attributes.selectedParent}
                        options={[{ label: __('Select Parent Category', 'custom-search-block'), value: '' }, ...parentCategories]}
                        onChange={handleParentChange}
                    />
                    <TextControl
                        label={__('Search Placeholder', 'custom-search-block')}
                        value={attributes.searchPlaceholder}
                        onChange={(value) => setAttributes({ searchPlaceholder: value })}
                    />
                </PanelBody>
            </InspectorControls>
            <div className="search_form">
                <form className="mfcvl-config-store-locator-search-form" action="/search" method="get">
                    <div className="form-type-filter form-item form-type-textfield form-no-label">
                        <label htmlFor="edit-search" className="visually-hidden">Search</label>
                        <input
                            placeholder={attributes.searchPlaceholder}
                            type="text"
                            id="edit-search"
                            name="search"
                            value={attributes.searchValue}
                            onChange={(e) => setAttributes({ searchValue: e.target.value })}
                            className="form-text"
                        />
                    </div>
                    {attributes.selectedParent && (
                        <div className="custom-selectpicker_1 form-item form-type-select form-no-label">
                            <label htmlFor="edit-searchbytype" className="visually-hidden">Filtre</label>
                            <select
                                id="edit-searchbytype"
                                name="searchByType"
                                value={attributes.selectedChild}
                                onChange={(e) => setAttributes({ selectedChild: e.target.value })}
                                className="form-select selectpicker"
                            >
                                <option value="">{selectedParentLabel}</option>
                                {childCategories.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <input type="hidden" name="form_id" value="mfcvl_config_store_locator_search_form" />
                    <div className="form-actions">
                        <input
                            className="cta violet button form-submit"
                            type="submit"
                            name="op"
                            value={__('Rechercher', 'custom-search-block')}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}