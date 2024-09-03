/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
    const blockProps = useBlockProps.save();

    // Get the label of the selected parent category to use as a placeholder
    const selectedParentLabel = attributes.parentCategories?.find(cat => cat.value === attributes.selectedParent)?.label || 'Type de structure';

    return (
        <div { ...blockProps }>
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
                            className="form-text"
                        />
                    </div>
                    <div className="custom-selectpicker_1 form-item form-type-select form-no-label">
                        <label htmlFor="edit-searchbytype" className="visually-hidden">Filter</label>
                        <select
                            id="edit-searchbytype"
                            name="searchByType"
                            value={attributes.selectedChild || ''}
                            className="form-select selectpicker"
                        >
                            <option value="">{selectedParentLabel}</option>
                            {attributes.childCategories && attributes.childCategories.map((category) => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <input type="hidden" name="form_id" value="mfcvl_config_store_locator_search_form" />
                    <div className="form-actions">
                        <input
                            className="cta violet button form-submit"
                            type="submit"
                            name="op"
                            value="Rechercher"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
