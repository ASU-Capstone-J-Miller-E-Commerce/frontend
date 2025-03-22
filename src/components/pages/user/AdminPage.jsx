import React, { useEffect, useState, useRef } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormField, FormTextArea, FormSelect, DefaultToggle, FormMultiSelect } from '../../util/Inputs';
import { DefaultButton } from '../../util/Buttons';
import { getUsers, createUser, editUser, changePassword, deleteUser, getAccessories, createAccessory, editAccessory, deleteAccessory, getMaterials, createWood, editWood, createCrystal, editCrystal, deleteCrystal, deleteWood } from '../../../util/requests';
import { receiveResponse } from '../../../util/notifications';
import { AdminSkeletonLoader } from '../../util/Util';
import { useSelector } from 'react-redux';

const COLOR_OPTIONS = [
    { value: 'black', label: 'Black' },
    { value: 'blue', label: 'Blue' },
    { value: 'brown_light', label: 'Brown - Light' },
    { value: 'brown_med', label: 'Brown - Med' },
    { value: 'brown_dark', label: 'Brown - Dark' },
    { value: 'cream', label: 'Cream' },
    { value: 'green_light', label: 'Green - Light' },
    { value: 'green_med', label: 'Green - Med' },
    { value: 'green_dark', label: 'Green - Dark' },
    { value: 'green_tint', label: 'Green Tint' },
    { value: 'grey_light', label: 'Grey - Light' },
    { value: 'grey_med', label: 'Grey - Med' },
    { value: 'grey_dark', label: 'Grey - Dark' },
    { value: 'orange', label: 'Orange' },
    { value: 'pink', label: 'Pink' },
    { value: 'purple', label: 'Purple' },
    { value: 'red_light', label: 'Red - Light' },
    { value: 'red_med', label: 'Red - Med' },
    { value: 'red_bright', label: 'Red - Bright' },
    { value: 'white', label: 'White' },
    { value: 'yellow_light', label: 'Yellow - Light' },
    { value: 'yellow_med', label: 'Yellow - Med' },
    { value: 'yellow_bright', label: 'Yellow - Bright' }
];

const METAPHYSICAL_OPTIONS = [
    { value: 'none', label: 'Not yet available. Currently being researched' },
    { value: 'ambition', label: 'Ambition' },
    { value: 'balance', label: 'Balance' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'calming', label: 'Calming' },
    { value: 'clarity', label: 'Clarity' },
    { value: 'concentration', label: 'Concentration' },
    { value: 'confidence', label: 'Confidence' },
    { value: 'connectedness', label: 'Connectedness' },
    { value: 'control', label: 'Control' },
    { value: 'creativity', label: 'Creativity' },
    { value: 'energy', label: 'Energy' },
    { value: 'focus', label: 'Focus' },
    { value: 'grounding', label: 'Grounding' },
    { value: 'growth', label: 'Growth' },
    { value: 'harmony', label: 'Harmony' },
    { value: 'healing', label: 'Healing' },
    { value: 'imagination', label: 'Imagination' },
    { value: 'insight', label: 'Insight' },
    { value: 'inspiration', label: 'Inspiration' },
    { value: 'integrity', label: 'Integrity' },
    { value: 'intuition', label: 'Intuition' },
    { value: 'kindness', label: 'Kindness' },
    { value: 'knowledge', label: 'Knowledge' },
    { value: 'logic', label: 'Logic' },
    { value: 'love', label: 'Love' },
    { value: 'loyalty', label: 'Loyalty' },
    { value: 'new_beginnings', label: 'New Beginnings' },
    { value: 'peace', label: 'Peace' },
    { value: 'positive_luck', label: 'Positive Luck' },
    { value: 'power', label: 'Power' },
    { value: 'precision', label: 'Precision' },
    { value: 'protection', label: 'Protection' },
    { value: 'purity', label: 'Purity' },
    { value: 'resilience', label: 'Resilience' },
    { value: 'spiritual_guidance', label: 'Spiritual Guidance' },
    { value: 'spiritual_amplification', label: 'Spiritual Amplification' },
    { value: 'strength', label: 'Strength' },
    { value: 'wisdom', label: 'Wisdom' }
];

const STATUS_OPTIONS_AVAILABLE = [
    { label: 'Available' },
    { label: 'Not Available' }
];

const STATUS_OPTIONS_CUE = [
    ...STATUS_OPTIONS_AVAILABLE,
    { label: 'Sold' },
    { label: 'Coming Soon' }
];

const TIP_SIZE_OPTIONS = [
    { value: '11.75', label: '11.75' },
    { value: '12.0', label: '12.0' },
    { value: '12.25', label: '12.25' },
    { value: '12.4', label: '12.4' },
    { value: '12.5', label: '12.5' },
    { value: '12.75', label: '12.75' },
    { value: '13.0', label: '13.0' }
];

const SHAFT_TAPER_OPTIONS = [
    { value: 'pro_taper', label: 'Pro-Taper' },
    { value: 'break_jump', label: 'Break / Jump' },
    { value: 'carom', label: 'Carom' }
];

const JOINT_PIN_SIZE_OPTIONS = [
    { value: '5_16_14', label: '5/16-14 (Std.)' },
    { value: '5_16_18', label: '5/16-18' },
    { value: '3_8_10', label: '3/8-10' },
    { value: '3_8_10_mod', label: '3/8-10 Modified' },
    { value: 'american_ball', label: 'American Ball Thd / Radial' },
    { value: 'wavy', label: 'Wavy' },
    { value: 'quick_release', label: 'Quick Release' },
    { value: 'uni_loc', label: 'Uni-Loc' },
    { value: 'special', label: 'Special' }
];

const BASIC_SIZE_OPTIONS = [
    { value: 'small', label: 'Small / Extra-Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'extra_large', label: 'Extra Large' },
    { value: 'complex', label: 'Complex' },
    { value: 'multi', label: 'Multi-color/-mat\'l' }
];

const PSYCHOLOGICAL_CORRESPONDENCE_OPTIONS = [
    { value: 'abundance', label: 'Abundance' },
    { value: 'acceptance', label: 'Acceptance' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'alleviates_sorrow', label: 'Alleviates Sorrow' },
    { value: 'ambition', label: 'Ambition' },
    { value: 'assertiveness', label: 'Assertiveness' },
    { value: 'attracts_new_love', label: 'Attracts New Love' },
    { value: 'attracts_prosperity', label: 'Attracts Prosperity' },
    { value: 'awareness', label: 'Awareness' },
    { value: 'awakenings', label: 'Awakenings' },
    { value: 'balance', label: 'Balance' },
    { value: 'balanced_judgement', label: 'Balanced Judgement' },
    { value: 'benevolence', label: 'Benevolence' },
    { value: 'bliss', label: 'Bliss' },
    { value: 'business_booster', label: 'Business Booster' },
    { value: 'calmness', label: 'Calmness' },
    { value: 'change', label: 'Change' },
    { value: 'changes_for_success', label: 'Changes for Success' },
    { value: 'charisma', label: 'Charisma' },
    { value: 'clarity', label: 'Clarity' },
    { value: 'communication', label: 'Communication' },
    { value: 'compassion', label: 'Compassion' },
    { value: 'concentration', label: 'Concentration' },
    { value: 'confidence', label: 'Confidence' },
    { value: 'contentment', label: 'Contentment' },
    { value: 'control', label: 'Control' },
    { value: 'courage', label: 'Courage' },
    { value: 'creating_positivity', label: 'Creating Positivity' },
    { value: 'creativity', label: 'Creativity' },
    { value: 'decision_making', label: 'Decision-Making' },
    { value: 'deeper_self_awareness', label: 'Deeper Self-Awareness' },
    { value: 'determination', label: 'Determination' },
    { value: 'diplomacy', label: 'Diplomacy' },
    { value: 'drive', label: 'Drive' },
    { value: 'emotional_balance', label: 'Emotional Balance' },
    { value: 'emotional_ease', label: 'Emotional Ease' },
    { value: 'emotional_healing', label: 'Emotional Healing' },
    { value: 'emotional_honesty', label: 'Emotional Honesty' },
    { value: 'emotional_mastery', label: 'Emotional Mastery' },
    { value: 'emotional_security', label: 'Emotional Security' },
    { value: 'emotional_strength', label: 'Emotional Strength' },
    { value: 'empathy', label: 'Empathy' },
    { value: 'empowerment', label: 'Empowerment' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'enlightenment', label: 'Enlightenment' },
    { value: 'enthusiasm', label: 'Enthusiasm' },
    { value: 'fast_acting_love', label: 'Fast-Acting Love Attractor' },
    { value: 'fast_progress', label: 'Fast Progress toward Success' },
    { value: 'fearlessness', label: 'Fearlessness' },
    { value: 'feminine_vitality', label: 'Feminine Vitality' },
    { value: 'fidelity', label: 'Fidelity' },
    { value: 'fine_tuned_perception', label: 'Fine-Tuned Perception' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'focus', label: 'Focus' },
    { value: 'forgiveness', label: 'Forgiveness' },
    { value: 'fortitude', label: 'Fortitude' },
    { value: 'freedom_from_expectations', label: 'Freedom from Expectations' },
    { value: 'generosity', label: 'Generosity' },
    { value: 'getting_what_you_desire', label: 'Getting what you Desire' },
    { value: 'good_decision_making', label: 'Good Decision-Making' },
    { value: 'good_fortune', label: 'Good Fortune' },
    { value: 'good_luck', label: 'Good Luck' },
    { value: 'good_will', label: 'Good Will' },
    { value: 'grounding', label: 'Grounding' },
    { value: 'growth', label: 'Growth' },
    { value: 'harmony', label: 'Harmony' },
    { value: 'harmonious_relations', label: 'Harmonious Relations' },
    { value: 'heals_heartbreak', label: 'Heals Heartbreak' },
    { value: 'healing', label: 'Healing' },
    { value: 'holistic_balance', label: 'Holistic Balance' },
    { value: 'holistic_well_being', label: 'Holistic Well-Being' },
    { value: 'honesty', label: 'Honesty' },
    { value: 'imagination', label: 'Imagination' },
    { value: 'inner_peace', label: 'Inner Peace' },
    { value: 'insight', label: 'Insight' },
    { value: 'inspiration', label: 'Inspiration' },
    { value: 'integrity', label: 'Integrity' },
    { value: 'intellectual_acumen', label: 'Intellectual Acumen' },
    { value: 'intellectual_power', label: 'Intellectual Power' },
    { value: 'intuition', label: 'Intuition' },
    { value: 'joy', label: 'Joy' },
    { value: 'letting_go', label: 'Letting Go' },
    { value: 'loving_communication', label: 'Loving Communication' },
    { value: 'luck', label: 'Luck' },
    { value: 'magical_well_being', label: 'Magical Well-Being' },
    { value: 'magnet_for_love', label: 'Magnet for Love' },
    { value: 'manifesting_intentions', label: 'Manifesting Intentions' },
    { value: 'manifests_desire', label: 'Manifests Desire' },
    { value: 'motivation', label: 'Motivation' },
    { value: 'new_beginnings', label: 'New Beginnings' },
    { value: 'new_romance', label: 'New Romance' },
    { value: 'non_judgemental_love', label: 'Non-Judgemental Love & Acceptance' },
    { value: 'objectivity', label: 'Objectivity' },
    { value: 'optimism', label: 'Optimism' },
    { value: 'originality', label: 'Originality' },
    { value: 'passion', label: 'Passion' },
    { value: 'patience', label: 'Patience' },
    { value: 'peace', label: 'Peace' },
    { value: 'perception', label: 'Perception' },
    { value: 'personal_freedom', label: 'Personal Freedom' },
    { value: 'personal_growth', label: 'Personal Growth' },
    { value: 'positive_attitude', label: 'Positive Attitude' },
    { value: 'positive_change', label: 'Positive Change' },
    { value: 'positive_romantic_change', label: 'Positive Romantic Change' },
    { value: 'positivity', label: 'Positivity' },
    { value: 'potent_success', label: 'Potent Success' },
    { value: 'progress', label: 'Progress' },
    { value: 'protection', label: 'Protection' },
    { value: 'protects_from_anger', label: 'Protects from Other\'s Anger' },
    { value: 'rationality', label: 'Rationality' },
    { value: 'realism', label: 'Realism' },
    { value: 'reliable_perception', label: 'Reliable Perception' },
    { value: 'self_assurance', label: 'Self-Assurance' },
    { value: 'self_awareness', label: 'Self-Awareness' },
    { value: 'self_belief', label: 'Self-Belief' },
    { value: 'self_confidence', label: 'Self-Confidence' },
    { value: 'self_control', label: 'Self-Control' },
    { value: 'self_esteem', label: 'Self-Esteem' },
    { value: 'self_expression', label: 'Self-Expression' },
    { value: 'self_love', label: 'Self-Love' },
    { value: 'self_reliance', label: 'Self-Reliance' },
    { value: 'self_respect', label: 'Self-Respect' },
    { value: 'self_value', label: 'Self-Value' },
    { value: 'self_worth', label: 'Self-Worth' },
    { value: 'serenity', label: 'Serenity' },
    { value: 'sexual_excitement', label: 'Sexual Excitement' },
    { value: 'sexual_self_reflection', label: 'Sexual Self-Reflection' },
    { value: 'sharp_mind', label: 'Sharp Mind' },
    { value: 'sociability', label: 'Sociability' },
    { value: 'soul_attraction', label: 'Soul Attraction' },
    { value: 'spiritual_growth', label: 'Spiritual Growth' },
    { value: 'spiritual_love', label: 'Spiritual Love' },
    { value: 'spontaneity', label: 'Spontaneity' },
    { value: 'stability', label: 'Stability' },
    { value: 'stone_to_sell_success', label: 'Stone to "Sell Your Success"' },
    { value: 'strength', label: 'Strength' },
    { value: 'strength_of_mind', label: 'Strength of Mind' },
    { value: 'stress_reduction', label: 'Stress-Reduction' },
    { value: 'stress_relief', label: 'Stress-Relief' },
    { value: 'success', label: 'Success' },
    { value: 'synchronicity', label: 'Synchronicity' },
    { value: 'tenacity', label: 'Tenacity' },
    { value: 'togetherness', label: 'Togetherness' },
    { value: 'tolerance', label: 'Tolerance' },
    { value: 'transformation', label: 'Transformation' },
    { value: 'trust', label: 'Trust' },
    { value: 'trusting_instincts', label: 'Trusting Instincts' },
    { value: 'truth', label: 'Truth' },
    { value: 'unconditional_love', label: 'Unconditional Love' },
    { value: 'understanding', label: 'Understanding' },
    { value: 'uplifts', label: 'Uplifts' },
    { value: 'vitality', label: 'Vitality' },
    { value: 'will', label: 'Will' },
    { value: 'willpower', label: 'Willpower' },
    { value: 'zesty_for_living', label: 'Zesty for Living' }
];

const CRYSTAL_CATEGORY_OPTIONS = [
    { value: 'abundance_good_fortune', label: 'For Abundance & Good Fortune' },
    { value: 'love', label: 'For Love' },
    { value: 'success', label: 'For Success' },
    { value: 'well_being', label: 'For Well-Being' }
];

export default function AdminPage() {
    const user = useSelector(state => state.user);
    const isAdmin = user?.role === "Admin";
    if (!isAdmin) {
        return null; // return nothing if user is not an admin (already handled by AdminRoute but just in case)
    }

    const [adminPage, setAdminPage] = useState('Cues');
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});
    const [passwordDialogProps, setPasswordDialogProps] = useState({});
    const [deleteDialogProps, setDeleteDialogProps] = useState({});

    const [cueData, setCueData] = useState(null);
    const [accessoryData, setAccessoryData] = useState(null);
    const [materialData, setMaterialData] = useState(null);
    const [userData, setUserData] = useState(null);

    const getData = async () => {
        setLoading(true);

        switch (adminPage) {
            case 'Cues':
                setLoading(false);
                break;
            case 'Accessories':
                getAccessories()
                    .then((res) => {
                        setLoading(false);
                        setAccessoryData(res.data);
                    })
                    .catch((err) => {
                        setLoading(false);
                    });
                break;
            case 'Materials':
                getMaterials()
                    .then((res) => {
                        setLoading(false);
                        setMaterialData(res.data);
                    })
                    .catch((err) => {
                        setLoading(false);
                    });
                break;
            case 'Users':
                getUsers()
                    .then((res) => {
                        setLoading(false);
                        setUserData(res.data);
                    })
                    .catch((err) => {
                        setLoading(false);
                    });
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        // Only load data if it's null for the current page
        if (
            (adminPage === 'Cues' && cueData === null) ||
            (adminPage === 'Accessories' && accessoryData === null) ||
            (adminPage === 'Materials' && materialData === null) ||
            (adminPage === 'Users' && userData === null)
        ) {
            getData();
        }
    }, [adminPage]);

    const handleDialogOpen = (props) => {
        setDialogProps({ ...props });
        setDialogOpen(true);
    };

    const handlePasswordDialogOpen = (props) => {
        setPasswordDialogProps({ ...props, title: 'Change Password' });
        setPasswordDialogOpen(true);
    };

    const handleDeleteDialogOpen = (props) => {
        setDeleteDialogProps({ ...props });
        setDeleteDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setDialogProps({});
    };

    const handlePasswordDialogClose = () => {
        setPasswordDialogOpen(false);
        setPasswordDialogProps({});
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setDeleteDialogProps({});
    };

    return (
        <div>
            <AdminHeader setAdminPage={setAdminPage} adminPage={adminPage} loading={loading} onPlusClick={handleDialogOpen} />
            <div className='user-content'>
                <AdminContent adminPage={adminPage} loading={loading} onEditClick={handleDialogOpen} onPasswordEditClick={handlePasswordDialogOpen} onDeleteClick={handleDeleteDialogOpen} cueData={cueData || []} accessoryData={accessoryData || []} materialData={materialData || []} userData={userData || []} />
            </div>
            {adminPage === 'Cues' && <CueDialog open={dialogOpen} onClose={handleDialogClose} getData={getData} {...dialogProps} />}
            {adminPage === 'Accessories' && <AccessoryDialog open={dialogOpen} onClose={handleDialogClose} getData={getData} {...dialogProps} />}
            {adminPage === 'Materials' && <MaterialDialog open={dialogOpen} onClose={handleDialogClose} getData={getData} {...dialogProps} />}
            {adminPage === 'Users' && <UserDialog open={dialogOpen} onClose={handleDialogClose} getData={getData} {...dialogProps} />}
            {passwordDialogOpen && <PasswordDialog open={passwordDialogOpen} onClose={handlePasswordDialogClose} getData={getData} {...passwordDialogProps} />}
            {deleteDialogOpen && <DeleteDialog open={deleteDialogOpen} onClose={handleDeleteDialogClose} getData={getData} adminPage={adminPage} {...deleteDialogProps} />}
        </div>
    );
}

function AdminHeader({ setAdminPage, adminPage, loading, onPlusClick }) {
    const pages = ['Cues', 'Accessories', 'Materials', 'Users'];

    const handlePlusClick = () => {
        let title = '';

        switch (adminPage) {
            case 'Cues':
                title = 'New Cue';
                break;
            case 'Accessories':
                title = 'New Accessory';
                break;
            case 'Materials':
                title = 'New Material';
                break;
            case 'Users':
                title = 'New User';
                break;
        }

        onPlusClick({ title: title });
    }

    return (
        <div className="admin-header">
            <ul className="admin-header-list">
                {pages.map((page) => (
                    <li key={page} className="admin-header-item">
                        <button
                            className={`admin-button ${adminPage === page ? 'active' : ''}`}
                            onClick={() => setAdminPage(page)}
                        >
                            {page}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="admin-header-right">
                <button
                    className={`admin-icon-button ${loading ? 'disabled' : ''}`}
                    disabled={loading}
                    onClick={handlePlusClick}
                >
                    <i className="fas fa-plus"></i>
                </button>
            </div>
        </div>
    );
}

function AdminContent({ adminPage, loading, onEditClick, onPasswordEditClick, onDeleteClick, cueData, accessoryData, materialData, userData }) {
    const data = [
        { id: 1, firstName: 'John', lastName: 'Doe', age: 30 },
        { id: 2, firstName: 'Jane', lastName: 'Smith', age: 25 },
        { id: 3, firstName: 'Alice', lastName: 'Johnson', age: 22 },
        { id: 4, firstName: 'Bob', lastName: 'Brown', age: 45 },
        { id: 5, firstName: 'Carol', lastName: 'Martinez', age: 32 },
        { id: 6, firstName: 'Dave', lastName: 'Wilson', age: 28 },
        { id: 7, firstName: 'Eva', lastName: 'Davis', age: 35 },
        { id: 8, firstName: 'Frank', lastName: 'Garcia', age: 40 },
        { id: 9, firstName: 'Grace', lastName: 'Lee', age: 29 },
        { id: 10, firstName: 'Henry', lastName: 'Anderson', age: 31 },
        { id: 11, firstName: 'Isabel', lastName: 'Thomas', age: 26 },
        { id: 12, firstName: 'Jack', lastName: 'Moore', age: 23 },
        { id: 13, firstName: 'Laura', lastName: 'Taylor', age: 27 },
        { id: 14, firstName: 'Mike', lastName: 'Jackson', age: 33 },
        { id: 15, firstName: 'Nora', lastName: 'White', age: 34 },
        { id: 16, firstName: 'Oscar', lastName: 'Harris', age: 37 },
        { id: 17, firstName: 'Pamela', lastName: 'Clark', age: 38 },
    ];

    if (loading) {
        return <AdminSkeletonLoader />;
    }

    switch (adminPage) {
        case 'Cues':
            return <CuesTable data={data} onEditClick={onEditClick} onDeleteClick={onDeleteClick} />;
        case 'Accessories':
            return <AccessoriesTable data={accessoryData} onEditClick={onEditClick} onDeleteClick={onDeleteClick} />;
        case 'Materials':
            return <MaterialsTable data={materialData} onEditClick={onEditClick} onDeleteClick={onDeleteClick} />;
        case 'Users':
            return <UsersTable data={userData} onEditClick={onEditClick} onPasswordEditClick={onPasswordEditClick} onDeleteClick={onDeleteClick} />;
        default:
            return null;
    }
}

function CuesTable({ data, onEditClick }) {
    const columns = [
        {
            accessorKey: 'firstName',
            header: 'First Name',
        },
        {
            accessorKey: 'lastName',
            header: 'Last Name',
        },
        {
            accessorKey: 'age',
            header: 'Age',
        },
        {
            id: 'actions',
            header: 'Actions',
            Cell: ({ row }) => (
                <div className='admin-actions'>
                    <button
                        className='fa-solid fa-pencil admin-action-button'
                        onClick={() => onEditClick({ element: row.original, title: `Edit Cue '${row.original.name}'` })}
                    />
                    <button className='fa-solid fa-trash admin-action-button' />
                </div>
            ),
        },
    ];

    return (
        <div>
            <h2 className="admin-page-header">Cues</h2>
            <MaterialReactTable
                columns={columns}
                data={data}
                {...tableProps}
            />
        </div>
    );
}

function AccessoriesTable({ data, onEditClick, onDeleteClick }) {
    const columns = [
        {
            accessorKey: 'accessoryNumber',
            header: 'Accessory Number',
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'price',
            header: 'Price',
        },
        {
            accessorKey: 'status',
            header: 'Status',
        },
        {
            header: 'Actions',
            Cell: ({ row }) => (
                <div className='admin-actions'>
                    <button
                        className='fa-solid fa-pencil admin-action-button'
                        onClick={() => onEditClick({ element: row.original })}
                    />
                    <button
                        className='fa-solid fa-trash admin-action-button'
                        onClick={() => onDeleteClick({
                            element: row.original,
                            title: `Delete Accessory '${row.original.name}'`
                        })}
                    />
                </div>
            ),
        },
    ];

    return (
        <div>
            <h2 className="admin-page-header">Accessories</h2>
            <MaterialReactTable
                columns={columns}
                data={data}
                {...tableProps}
            />
        </div>
    );
}

function MaterialsTable({ data, onEditClick, onDeleteClick }) {
    const columns = [
        {
            header: 'Type',
            accessorFn: (row) => row.commonName ? 'Wood' : row.crystalName ? 'Stone/Crystal' : 'Unknown',
            id: 'materialType',
        },
        {
            header: 'Name',
            accessorFn: (row) => row.commonName || row.crystalName || '',
            id: 'materialName',
        },
        {
            header: 'Tier',
            accessorKey: 'tier',
        },
        {
            header: 'Status',
            accessorKey: 'status',
        },
        {
            header: 'Actions',
            Cell: ({ row }) => (
                <div className='admin-actions'>
                    <button
                        className='fa-solid fa-pencil admin-action-button'
                        onClick={() => onEditClick({ element: row.original })}
                    />
                    <button
                        className='fa-solid fa-trash admin-action-button'
                        onClick={() => onDeleteClick({
                            element: row.original,
                            title: `Delete ${row.original.commonName ? 'Wood' : 'Stone/Crystal'} '${row.original.commonName || row.original.crystalName}'`
                        })}
                    />
                </div>
            ),
        },
    ];

    return (
        <div>
            <h2 className="admin-page-header">Materials</h2>
            <MaterialReactTable
                columns={columns}
                data={data}
                {...tableProps}
            />
        </div>
    );
}

function UsersTable({ data, onEditClick, onPasswordEditClick, onDeleteClick }) {
    const columns = [
        {
            accessorKey: 'firstName',
            header: 'First Name',
        },
        {
            accessorKey: 'lastName',
            header: 'Last Name',
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            header: 'Password',
            Cell: ({ row }) => (
                <div className='admin-actions'>
                    <button
                        className='fa-solid fa-pencil admin-action-button'
                        onClick={() => onPasswordEditClick({ element: row.original })}
                    />
                </div>
            ),
        },
        {
            header: 'Actions',
            Cell: ({ row }) => (
                <div className='admin-actions'>
                    <button
                        className='fa-solid fa-pencil admin-action-button'
                        onClick={() => onEditClick({ element: row.original, title: `Edit User '${row.original.firstName}'` })}
                    />
                    <button
                        className='fa-solid fa-trash admin-action-button'
                        onClick={() => onDeleteClick({ element: row.original, title: `Delete User '${row.original.firstName}'` })}
                    />
                </div>
            ),
        },
    ];

    return (
        <div>
            <h2 className="admin-page-header">Users</h2>
            <MaterialReactTable
                columns={columns}
                data={data}
                {...tableProps}
            />
        </div>
    );
}

function CueDialog({ open, onClose, title, getData, element = {
    cueNumber: '',
    name: '',
    description: '',
    price: '',
    overallWeight: '',
    overallLength: '',
    tipSize: '12.4', // Default to 12.4
    ferruleMaterial: 'juma',
    shaftMaterial: '',
    shaftTaper: '',
    jointPinSize: '3_8_10',
    jointPinMaterial: '',
    jointCollarMaterial: 'black_juma',
    forearmMaterial: '',
    handleMaterial: '',
    handleWrapMaterial: '',
    buttSleeveMaterial: '',
    jointRings: '',
    handleRings: '',
    buttRings: '',
    buttWeight: '',
    buttLength: '',
    buttCapMaterial: 'juma',
    status: '',
    forearmInlayQuantity: '',
    forearmInlaySize: '',
    buttsleeveInlayQuantity: '',
    buttsleeveInlaySize: '',
    ringsInlayQuantity: '',
    ringsInlaySize: '',
    forearmPointQuantity: '',
    forearmPointSize: '',
    forearmPointVeneerColors: [], // Changed to plural and array
    buttSleevePointQuantity: '',
    buttSleevePointSize: '',
    buttSleevePointVeneerColors: [], // Changed to plural and array
  }}) {
    const [includeWrap, setIncludeWrap] = useState(false);
    const [includeForearmPointVeneers, setIncludeForearmPointVeneers] = useState(false);
    const [includeButtSleevePointVeneers, setIncludeButtSleevePointVeneers] = useState(false);
    const [includeInlays, setIncludeInlays] = useState(false);

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
        defaultValues: element
    });

    const formRef = useRef(null);
    
    useEffect(() => {
        if (open) {
            reset(element);
        }
    }, [open, reset]);

    const onSubmit = (data) => {
        console.log(data);
        onClose();
    };

    const handleSaveClick = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    const cueNumber = watch("cueNumber");
    const name = watch("name");
    const description = watch("description");
    const price = watch("price");
    const overallWeight = watch("overallWeight");
    const overallLength = watch("overallLength");
    const status = watch("status");
    const tipSize = watch("tipSize");
    const ferruleMaterial = watch("ferruleMaterial");
    const shaftMaterial = watch("shaftMaterial");
    const shaftTaper = watch("shaftTaper");
    const jointPinSize = watch("jointPinSize");
    const jointPinMaterial = watch("jointPinMaterial");
    const jointCollarMaterial = watch("jointCollarMaterial");
    const forearmMaterial = watch("forearmMaterial");
    const handleMaterial = watch("handleMaterial");
    const handleWrapMaterial = watch("handleWrapMaterial");
    const buttSleeveMaterial = watch("buttSleeveMaterial");
    const jointRings = watch("jointRings");
    const handleRings = watch("handleRings");
    const buttRings = watch("buttRings");
    const buttWeight = watch("buttWeight");
    const buttLength = watch("buttLength");
    const buttCapMaterial = watch("buttCapMaterial");
    const forearmPointQuantity = watch("forearmPointQuantity");
    const forearmPointSize = watch("forearmPointSize");
    const forearmPointVeneerColors = watch("forearmPointVeneerColors");
    const buttSleevePointQuantity = watch("buttSleevePointQuantity");
    const buttSleevePointSize = watch("buttSleevePointSize");
    const buttSleevePointVeneerColors = watch("buttSleevePointVeneerColors");
    const forearmInlayQuantity = watch("forearmInlayQuantity");
    const forearmInlaySize = watch("forearmInlaySize");
    const buttsleeveInlayQuantity = watch("buttsleeveInlayQuantity");
    const buttsleeveInlaySize = watch("buttsleeveInlaySize");
    const ringsInlayQuantity = watch("ringsInlayQuantity");
    const ringsInlaySize = watch("ringsInlaySize");

    const materialOptions = [
        { value: 'juma', label: 'Juma' },
        { value: 'black_juma', label: 'Black Juma' },
        { value: 'rubber', label: 'Rubber' },
        { value: 'wood', label: 'Wood' }
    ];

    return (
        <Dialog open={open} onClose={onClose} fullScreen>
            <DialogTitle>
                {title}
                <div style={{ float: 'right', display: 'flex' }}>
                    <button
                        type="button"
                        className='fa-solid fa-floppy-disk admin-action-button'
                        style={{ display: 'inline-block', justifySelf: 'right', fontSize: '1.5rem', marginTop: '-0.05rem', marginRight: '20px' }}
                        onClick={handleSaveClick}
                    />
                    <button
                        type="button"
                        className='fa-solid fa-xmark admin-action-button'
                        style={{ display: 'inline-block', justifySelf: 'right', fontSize: '1.5rem', marginTop: '-0.05rem' }}
                        onClick={onClose}
                    />
                </div>
            </DialogTitle>
            <DialogContent>
                <form className="cue-form" onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <div className="form-column">
                        <div>
                            <h3 className="dialog-header">General Attributes</h3>
                            <div className="form-column">
                                <div className="form-row">
                                    <div className="flex-1">
                                        <FormField
                                            title="Cue Number*"
                                            type="text"
                                            value={cueNumber}
                                            error={errors.cueNumber && errors.cueNumber.message}
                                            {...register("cueNumber", {
                                                required: "Cue Number is required",
                                                maxLength: {
                                                    value: 50,
                                                    message: "Cue Number must be at most 50 characters long"
                                                }
                                            })}
                                        />
                                    </div>
                                    <div className="flex-2">
                                        <FormField
                                            title="Name*"
                                            type="text"
                                            value={name}
                                            error={errors.name && errors.name.message}
                                            {...register("name", {
                                                required: "Name is required",
                                                maxLength: {
                                                    value: 100,
                                                    message: "Name must be at most 100 characters long"
                                                }
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="flex-1">
                                        <FormField
                                            title="Price"
                                            type="number"
                                            value={price}
                                            {...register("price")}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <FormField
                                            title="Overall Weight (oz)"
                                            type="number"
                                            value={overallWeight}
                                            {...register("overallWeight")}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <FormField
                                            title="Overall Length (in)"
                                            type="number"
                                            value={overallLength}
                                            {...register("overallLength")}
                                        />
                                    </div>
                                </div>
                                <FormTextArea
                                    title="Description"
                                    value={description}
                                    {...register("description")}
                                />
                                <FormSelect
                                    title="Status*"
                                    value={status}
                                    error={errors.status && errors.status.message}
                                    options={STATUS_OPTIONS_CUE}
                                    displayKey="label"
                                    {...register("status", {
                                        required: "Status is required"
                                    })}
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="dialog-header">Shaft</h3>
                            <div>
                                <div className='form-row'>
                                    <div className='flex-1'>
                                        <FormSelect
                                            title="Shaft Material"
                                            value={shaftMaterial}
                                            options={materialOptions}
                                            displayKey="label"
                                            {...register("shaftMaterial")}
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <FormSelect
                                            title="Shaft Taper"
                                            value={shaftTaper}
                                            options={SHAFT_TAPER_OPTIONS} // Use the global constant instead of sizeOptions
                                            displayKey="label"
                                            {...register("shaftTaper")}
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <FormSelect
                                            title="Tip Size (mm)"
                                            value={tipSize}
                                            options={TIP_SIZE_OPTIONS} // Use the global constant here
                                            displayKey="label"
                                            {...register("tipSize")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="dialog-header2">Ferrule</h2>
                                <div className='form-row'>
                                    <div className='flex-1'>
                                        <FormSelect
                                            title="Ferrule Material"
                                            value={ferruleMaterial}
                                            options={materialOptions}
                                            displayKey="label"
                                            {...register("ferruleMaterial")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="dialog-header">Butt</h3>
                            <div>
                                <div className='form-row'>
                                    <div className='flex-1'>
                                        <FormField
                                            title="Butt Weight (oz)"
                                            type="number"
                                            value={buttWeight}
                                            {...register("buttWeight")}
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <FormField
                                            title="Butt Length (in)"
                                            type="number"
                                            value={buttLength}
                                            {...register("buttLength")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="dialog-header2">Joint Pin</h2>
                                <div className='form-row'>
                                    <div className='flex-1'>
                                        <FormSelect
                                            title="Joint Pin Size (in)"
                                            value={jointPinSize}
                                            options={JOINT_PIN_SIZE_OPTIONS}
                                            displayKey="label"
                                            {...register("jointPinSize")}
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <FormSelect
                                            title="Joint Pin Material"
                                            value={jointPinMaterial}
                                            options={materialOptions}
                                            displayKey="label"
                                            {...register("jointPinMaterial")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="dialog-header2">Joint Collar</h2>
                                <div className='form-row'>
                                    <div className='flex-1'>
                                        <FormSelect
                                            title="Joint Collar Material"
                                            value={jointCollarMaterial}
                                            options={materialOptions}
                                            displayKey="label"
                                            {...register("jointCollarMaterial")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="dialog-header2">Forearm</h2>
                                <div className='form-row'>
                                    <div className='flex-1'>
                                        <FormSelect
                                            title="Forearm Material"
                                            value={forearmMaterial}
                                            options={materialOptions}
                                            displayKey="label"
                                            {...register("forearmMaterial")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='form-row'>
                                    <h2 className="dialog-header2">Handle</h2>
                                    <DefaultToggle titleOn={"Include Wrap"} titleOff={"Exclude Wrap"} onChange={setIncludeWrap}/>
                                </div>
                                
                                <div className='form-row'>
                                    <div className='flex-1'>
                                        {includeWrap ? 
                                            <FormSelect
                                            title="Handle Wrap Material"
                                            value={handleWrapMaterial}
                                            options={materialOptions}
                                            displayKey="label"
                                            {...register("handleWrapMaterial")}
                                            />
                                        :
                                            <FormSelect
                                                title="Handle Material"
                                                value={handleMaterial}
                                                options={materialOptions}
                                                displayKey="label"
                                                {...register("handleMaterial")}
                                            />}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="dialog-header2">Butt Sleeve</h2>
                                <div className='form-row'>
                                    <div className='flex-1'>
                                        <FormSelect
                                            title="Butt Sleeve Material"
                                            value={buttSleeveMaterial}
                                            options={materialOptions}
                                            displayKey="label"
                                            {...register("buttSleeveMaterial")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="dialog-header2">Butt Cap</h2>
                                <div className='form-row'>
                                    <div className='flex-1'>
                                        <FormSelect
                                            title="Butt Cap Material"
                                            value={buttCapMaterial}
                                            options={materialOptions}
                                            displayKey="label"
                                            {...register("buttCapMaterial")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="dialog-header">Rings</h3>
                            <div className='form-row'>
                                <div className='flex-1'>
                                    <FormSelect
                                        title="Joint Rings Material"
                                        value={jointRings}
                                        options={materialOptions}
                                        displayKey="label"
                                        {...register("jointRings")}
                                    />
                                </div>
                                <div className='flex-1'>
                                    <FormSelect
                                        title="Handle Rings Material"
                                        value={handleRings}
                                        options={materialOptions}
                                        displayKey="label"
                                        {...register("handleRings")}
                                    />
                                </div>
                                <div className='flex-1'>
                                    <FormSelect
                                        title="Butt Rings Material"
                                        value={buttRings}
                                        options={materialOptions}
                                        displayKey="label"
                                        {...register("buttRings")}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="dialog-header">Points</h3>
                            <div>
                                <div className='form-row'>
                                    <h2 className="dialog-header2">Forearm Point</h2>
                                    <DefaultToggle titleOn={"Include Veneers"} titleOff={"Exclude Veneers"} onChange={setIncludeForearmPointVeneers}/>
                                </div>
                                <div className='form-row'>
                                    <div className='flex-1'>
                                        <FormField
                                            title="Quantity"
                                            type="number"
                                            value={forearmPointQuantity}
                                            {...register("forearmPointQuantity")}
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <FormSelect
                                            title="Size"
                                            value={forearmPointSize}
                                            options={BASIC_SIZE_OPTIONS}
                                            displayKey="label"
                                            {...register("forearmPointSize")}
                                        />
                                    </div>
                                    {includeForearmPointVeneers &&
                                        <div className='flex-1'>
                                        <FormMultiSelect
                                            title="Point Veneer Colors"
                                            value={forearmPointVeneerColors || []}
                                            options={COLOR_OPTIONS}
                                            displayKey="label"
                                            {...register("forearmPointVeneerColors")}
                                        />
                                    </div>}
                                </div>
                            </div>
                            <div>
                                <div className='form-row'>
                                    <h2 className="dialog-header2">Butt Sleeve Point</h2>
                                    <DefaultToggle titleOn={"Include Veneers"} titleOff={"Exclude Veneers"} onChange={setIncludeButtSleevePointVeneers}/>
                                </div>
                                
                                <div className='form-row'>
                                    <div className='flex-1'>
                                        <FormField
                                            title="Quantity"
                                            type="number"
                                            value={buttSleevePointQuantity}
                                            {...register("buttSleevePointQuantity")}
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <FormSelect
                                            title="Size"
                                            value={buttSleevePointSize}
                                            options={BASIC_SIZE_OPTIONS}
                                            displayKey="label"
                                            {...register("buttSleevePointSize")}
                                        />
                                    </div>
                                    {includeButtSleevePointVeneers &&
                                        <div className='flex-1'>
                                        <FormMultiSelect
                                            title="Point Veneer Colors"
                                            value={buttSleevePointVeneerColors || []}
                                            options={COLOR_OPTIONS}
                                            displayKey="label"
                                            {...register("buttSleevePointVeneerColors")}
                                        />
                                    </div>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='form-row'>
                                <h3 className="dialog-header">Inlays</h3>
                                <DefaultToggle titleOn={"Include Inlays"} titleOff={"Exclude Inlays"} onChange={setIncludeInlays}/>
                            </div>
                            {includeInlays && <>
                                <div>
                                    <h2 className="dialog-header2">Forearm Inlay</h2>
                                    <div className='form-row'>
                                        <div className='flex-1'>
                                            <FormField
                                                title="Quantity"
                                                type="number"
                                                value={forearmInlayQuantity}
                                                {...register("forearmInlayQuantity")}
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <FormSelect
                                                title="Size"
                                                value={forearmInlaySize}
                                                options={BASIC_SIZE_OPTIONS}
                                                displayKey="label"
                                                {...register("forearmInlaySize")}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="dialog-header2">Buttsleeve Inlay</h2>
                                    <div className='form-row'>
                                        <div className='flex-1'>
                                            <FormField
                                                title="Quantity"
                                                type="number"
                                                value={buttsleeveInlayQuantity}
                                                {...register("buttsleeveInlayQuantity")}
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <FormSelect
                                                title="Size"
                                                value={buttsleeveInlaySize}
                                                options={BASIC_SIZE_OPTIONS}
                                                displayKey="label"
                                                {...register("buttsleeveInlaySize")}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="dialog-header2">Rings Inlay</h2>
                                    <div className='form-row'>
                                        <div className='flex-1'>
                                            <FormField
                                                title="Quantity"
                                                type="number"
                                                value={ringsInlayQuantity}
                                                {...register("ringsInlayQuantity")}
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <FormSelect
                                                title="Size"
                                                value={ringsInlaySize}
                                                options={BASIC_SIZE_OPTIONS}
                                                displayKey="label"
                                                {...register("ringsInlaySize")}
                                            />
                                        </div>
                                    </div>
                                </div> 
                            </>}
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function AccessoryDialog({ open, onClose, title, getData, element = { name: '', description: '', price: '', accessoryNumber: '', status: '' } }) {
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
        defaultValues: element
    });

    const existingAccessory = !!element._id;
    
    const formRef = useRef(null);

    useEffect(() => {
        if (open) {
            reset(element);
        }
    }, [open, reset]);

    const onSubmit = (data) => {
        if (existingAccessory) {
            editAccessory(data._id, data.accessoryNumber, data.name, data.description, data.price, data.status)
                .then((res) => {
                    receiveResponse(res);
                    getData();
                    onClose();
                })
        } else {
            createAccessory(data.accessoryNumber, data.name, data.description, data.price, data.status)
                .then((res) => {
                    receiveResponse(res);
                    getData();
                    onClose();
                })
        }
    };
    
    const handleSaveClick = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    const name = watch("name");
    const description = watch("description");
    const price = watch("price");
    const accessoryNumber = watch("accessoryNumber");
    const status = watch("status");

    return (
        <Dialog open={open} onClose={onClose} fullScreen>
            <DialogTitle>
                {title}
                <div style={{ float: 'right', display: 'flex' }}>
                    <button
                        type="button"
                        className='fa-solid fa-floppy-disk admin-action-button'
                        style={{ display: 'inline-block', justifySelf: 'right', fontSize: '1.5rem', marginTop: '-0.05rem', marginRight: '20px' }}
                        onClick={handleSaveClick}
                    />
                    <button
                        type="button"
                        className='fa-solid fa-xmark admin-action-button'
                        style={{ display: 'inline-block', justifySelf: 'right', fontSize: '1.5rem', marginTop: '-0.05rem' }}
                        onClick={onClose}
                    />
                </div>
            </DialogTitle>
            <DialogContent>
                <form className="accessory-form" onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <div className="form-column">
                        <div className='form-row'>
                            <div className='flex-1'>
                                <FormField
                                    title="Accessory Number*"
                                    type="text"
                                    value={accessoryNumber}
                                    error={errors.accessoryNumber && errors.accessoryNumber.message}
                                    {...register("accessoryNumber", {
                                        required: "Accessory Number is required",
                                        maxLength: {
                                            value: 50,
                                            message: "Accessory Number must be at most 50 characters long"
                                        }
                                    })}
                                />
                            </div>
                            <div className='flex-2'>
                                <FormField
                                    title="Name*"
                                    type="text"
                                    value={name}
                                    error={errors.name && errors.name.message}
                                    {...register("name", {
                                        required: "Name is required",
                                        maxLength: {
                                            value: 100,
                                            message: "Name must be at most 100 characters long"
                                        }
                                    })}
                                />
                            </div>
                        </div>
                        
                        <FormTextArea
                            title="Description*"
                            value={description}
                            error={errors.description && errors.description.message}
                            {...register("description", {
                                required: "Description is required",
                                maxLength: {
                                    value: 1500,
                                    message: "Description must be at most 1500 characters long"
                                }
                            })}
                        />
                        <FormField
                            title="Price*"
                            type="number"
                            value={price}
                            error={errors.price && errors.price.message}
                            {...register("price", {
                                required: "Price is required",
                                min: {
                                    value: 0,
                                    message: "Price must be a positive number"
                                }
                            })}
                        />
                        <FormSelect
                            title="Status*"
                            value={status}
                            error={errors.status && errors.status.message}
                            options={STATUS_OPTIONS_AVAILABLE}
                            displayKey="label"
                            valueKey="label"
                            {...register("status", {
                                required: "Status is required"
                            })}
                        />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function MaterialDialog({ open, onClose, title, getData, element = false }) {
    const [materialType, setMaterialType] = useState('');

    const getDefaultValues = (type) => {
        const commonDefaults = {
            status: '',
            description: '',
            tier: '',
            colors: [],
        };

        if (type === 'wood') {
            return {
                ...commonDefaults,
                commonName: '',
                alternateName1: '',
                alternateName2: '',
                scientificName: '',
                brief: '',
                jankaHardness: '',
                treeHeight: '',
                trunkDiameter: '',
                geographicOrigin: '',
                streaksVeins: '',
                texture: '',
                grainPattern: '',
                metaphysicalTags: []
            };
        } else if (type === 'crystal') {
            return {
                ...commonDefaults,
                crystalName: '',
                crystalCategory: '',
                psychologicalCorrespondence: []
            };
        }

        return commonDefaults;
    };

    const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm({
        defaultValues: element || getDefaultValues('')
    });

    const existingMaterial = !!element._id;
    
    useEffect(() => {
        if (open) {
            if (element && element._id) {
                // Determine material type from element properties
                if (element.commonName || element.scientificName || element.jankaHardness) {
                    setMaterialType('wood');
                } else if (element.crystalName || element.crystalCategory || element.psychologicalCorrespondence) {
                    setMaterialType('crystal');
                }
                reset(element);
            } else {
                // New material
                setMaterialType('');
                reset(getDefaultValues());
            }
        }
    }, [open, reset]);

    useEffect(() => {
        if (materialType && !element._id) {
            reset({ ...getDefaultValues() });
        }
    }, [materialType]);

    const onSubmit = (data) => {
        if (materialType === 'wood') {
            if (existingMaterial) {
                editWood(
                    data._id,
                    data.commonName,
                    data.description,
                    data.status,
                    data.tier,
                    data.colors,
                    data.alternateName1,
                    data.alternateName2,
                    data.scientificName,
                    data.brief,
                    data.jankaHardness,
                    data.treeHeight,
                    data.trunkDiameter,
                    data.geographicOrigin,
                    data.streaksVeins,
                    data.texture,
                    data.grainPattern,
                    data.metaphysicalTags
                )
                    .then(res => {
                        receiveResponse(res);
                        getData();
                        onClose();
                    })
            } else {
                createWood(
                    data.commonName,
                    data.description,
                    data.status,
                    data.tier,
                    data.colors,
                    data.alternateName1,
                    data.alternateName2,
                    data.scientificName,
                    data.brief,
                    data.jankaHardness,
                    data.treeHeight,
                    data.trunkDiameter,
                    data.geographicOrigin,
                    data.streaksVeins,
                    data.texture,
                    data.grainPattern,
                    data.metaphysicalTags
                )
                    .then(res => {
                        receiveResponse(res);
                        getData();
                        onClose();
                    })
            }
        } else if (materialType === 'crystal') {
            if (existingMaterial) {
                editCrystal(
                    data._id,
                    data.crystalName,
                    data.description,
                    data.status,
                    data.tier,
                    data.colors,
                    data.crystalCategory,
                    data.psychologicalCorrespondence
                )
                    .then(res => {
                        receiveResponse(res);
                        getData();
                        onClose();
                    })
            } else {
                createCrystal(
                    data.crystalName,
                    data.description,
                    data.status,
                    data.tier,
                    data.colors,
                    data.crystalCategory,
                    data.psychologicalCorrespondence
                )
                    .then(res => {
                        receiveResponse(res);
                        getData();
                        onClose();
                    })
            }
        }
    };

    const formRef = useRef(null);
    
    const handleSaveClick = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    const materialTypeOptions = [
        { value: 'wood', label: 'Wood' },
        { value: 'crystal', label: 'Stone/Crystal' }
    ];

    const tierOptions = [
        { label: 'Tier 1' },
        { label: 'Tier 2' },
        { label: 'Tier 3' },
        { label: 'Tier 4' }
    ];

    const renderWoodAttributes = () => {
        const commonName = watch("commonName");
        const alternateName1 = watch("alternateName1");
        const alternateName2 = watch("alternateName2");
        const scientificName = watch("scientificName");
        const description = watch("description");
        const brief = watch("brief");
        const status = watch("status");
        const tier = watch("tier");
        const jankaHardness = watch("jankaHardness");
        const treeHeight = watch("treeHeight");
        const trunkDiameter = watch("trunkDiameter");
        const geographicOrigin = watch("geographicOrigin");
        const colors = watch("colors");
        const streaksVeins = watch("streaksVeins");
        const texture = watch("texture");
        const grainPattern = watch("grainPattern");
        const metaphysicalTags = watch("metaphysicalTags");
        
        return (
            <>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormField 
                            title="Common Name*"
                            value={commonName}
                            error={errors.commonName && errors.commonName.message}
                            {...register("commonName", {
                                required: "Common Name is required",
                                maxLength: {
                                    value: 100,
                                    message: "Common Name must be at most 100 characters long"
                                }
                            })}
                        />
                    </div>
                    <div className='flex-1'>
                        <FormField 
                            title="Alternate Name 1"
                            value={alternateName1}
                            {...register("alternateName1")}
                        />
                    </div>
                    <div className='flex-1'>
                        <FormField 
                            title="Alternate Name 2"
                            value={alternateName2}
                            {...register("alternateName2")}
                        />
                    </div>
                    <div className='flex-1'>
                        <FormField 
                            title="Scientific Name"
                            value={scientificName}
                            {...register("scientificName")}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormTextArea
                            title="Description*"
                            value={description}
                            error={errors.description && errors.description.message}
                            {...register("description", {
                                required: "Description is required"
                            })}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormTextArea
                            title="Brief"
                            value={brief}
                            {...register("brief")}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormSelect
                            title="Status*"
                            value={status}
                            options={STATUS_OPTIONS_AVAILABLE}
                            displayKey="label"
                            valueKey="label"
                            error={errors.status && errors.status.message}
                            {...register("status", {
                                required: "Status is required"
                            })}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormSelect
                            title="Tier*"
                            value={tier}
                            options={tierOptions}
                            displayKey="label"
                            valueKey="label"
                            error={errors.tier && errors.tier.message}
                            {...register("tier", {
                                required: "Tier is required"
                            })}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormField
                            title="Janka Hardness (lbf)"
                            type="number"
                            value={jankaHardness}
                            {...register("jankaHardness", {
                                min: {
                                    value: 0,
                                    message: "Hardness must be a positive number"
                                }
                            })}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormField
                            title="Tree height (ft)"
                            type="number"
                            value={treeHeight}
                            {...register("treeHeight", {
                                min: {
                                    value: 0,
                                    message: "Height must be a positive number"
                                }
                            })}
                        />
                    </div>
                    <div className='flex-1'>
                        <FormField
                            title="Trunk Diameter (ft)"
                            type="number"
                            value={trunkDiameter}
                            {...register("trunkDiameter", {
                                min: {
                                    value: 0,
                                    message: "Diameter must be a positive number"
                                }
                            })}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormField
                            title="Geographic Origin*"
                            value={geographicOrigin}
                            error={errors.geographicOrigin && errors.geographicOrigin.message}
                            {...register("geographicOrigin", {
                                required: "Geographic Origin is required"
                            })}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormMultiSelect
                            title="Colors*"
                            value={colors || []}
                            options={COLOR_OPTIONS}
                            displayKey="label"
                            error={errors.colors && errors.colors.message}
                            {...register("colors", {
                                required: "At least one color must be selected"
                            })}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormField
                            title="Streaks & Veins*"
                            value={streaksVeins}
                            error={errors.streaksVeins && errors.streaksVeins.message}
                            {...register("streaksVeins", {
                                required: "Streaks & Veins is required"
                            })}
                        />
                    </div>
                    <div className='flex-1'>
                        <FormField
                            title="Texture"
                            value={texture}
                            {...register("texture")}
                        />
                    </div>
                    <div className='flex-1'>
                        <FormField
                            title="Grain Pattern"
                            value={grainPattern}
                            {...register("grainPattern")}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormMultiSelect
                            title="Metaphysical Tags*"
                            value={metaphysicalTags || []}
                            options={METAPHYSICAL_OPTIONS}
                            displayKey="label"
                            error={errors.metaphysicalTags && errors.metaphysicalTags.message}
                            {...register("metaphysicalTags", {
                                required: "At least one metaphysical tag must be selected"
                            })}
                        />
                    </div>
                </div>
            </>
        );
    };

    const renderCrystalAttributes = () => {
        // Watch crystal-specific values
        const crystalName = watch("crystalName");
        const description = watch("description"); // Added description watch
        const crystalCategory = watch("crystalCategory");
        const colors = watch("colors");
        const psychologicalCorrespondence = watch("psychologicalCorrespondence");
        const status = watch("status");
        const tier = watch("tier"); // Added tier watch
        
        return (
            <>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormField 
                            title="Crystal Name*"
                            value={crystalName}
                            error={errors.crystalName && errors.crystalName.message}
                            {...register("crystalName", {
                                required: "Crystal Name is required"
                            })}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormTextArea
                            title="Description*"
                            value={description}
                            error={errors.description && errors.description.message}
                            {...register("description", {
                                required: "Description is required"
                            })}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormSelect
                            title="Status*"
                            value={status}
                            options={STATUS_OPTIONS_AVAILABLE}
                            displayKey="label"
                            valueKey="label"
                            error={errors.status && errors.status.message}
                            {...register("status", {
                                required: "Status is required"
                            })}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormSelect
                            title="Tier*"
                            value={tier}
                            options={tierOptions}
                            displayKey="label"
                            valueKey="label"
                            error={errors.tier && errors.tier.message}
                            {...register("tier", {
                                required: "Tier is required"
                            })}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormSelect
                            title="Crystal Category*"
                            value={crystalCategory}
                            options={CRYSTAL_CATEGORY_OPTIONS}
                            displayKey="label"
                            error={errors.crystalCategory && errors.crystalCategory.message}
                            {...register("crystalCategory", {
                                required: "Crystal Category is required"
                            })}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormMultiSelect
                            title="Colors*"
                            value={colors || []}
                            options={COLOR_OPTIONS}
                            displayKey="label"
                            error={errors.colors && errors.colors.message}
                            {...register("colors", {
                                required: "At least one color must be selected"
                            })}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='flex-1'>
                        <FormMultiSelect
                            title="Psychological Correspondence*"
                            value={psychologicalCorrespondence || []}
                            options={PSYCHOLOGICAL_CORRESPONDENCE_OPTIONS}
                            displayKey="label"
                            error={errors.psychologicalCorrespondence && errors.psychologicalCorrespondence.message}
                            {...register("psychologicalCorrespondence", {
                                required: "At least one psychological correspondence must be selected"
                            })}
                        />
                    </div>
                </div>
            </>
        );
    };
    
    return (
        <Dialog open={open} onClose={onClose} fullScreen>
            <DialogTitle>
                {title}
                <div style={{ float: 'right', display: 'flex' }}>
                    {materialType && <button
                        type="button"
                        className='fa-solid fa-floppy-disk admin-action-button'
                        style={{ display: 'inline-block', justifySelf: 'right', fontSize: '1.5rem', marginTop: '-0.05rem', marginRight: '20px' }}
                        onClick={handleSaveClick}
                    />}
                    <button
                        type="button"
                        className='fa-solid fa-xmark admin-action-button'
                        style={{ display: 'inline-block', justifySelf: 'right', fontSize: '1.5rem', marginTop: '-0.05rem' }}
                        onClick={onClose}
                    />
                </div>
            </DialogTitle>
            <DialogContent>
                <form className="material-form" onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <div className="form-column">
                        <FormSelect
                            title="Material Type*"
                            value={materialType}
                            options={materialTypeOptions}
                            displayKey="label"
                            valueKey="value"
                            onChange={(e) => setMaterialType(e.target.value)}
                        />
                        {materialType === 'wood' && renderWoodAttributes()}
                        {materialType === 'crystal' && renderCrystalAttributes()}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function UserDialog({ open, onClose, title, getData, element = { email: '', password: '', firstName: '', lastName: '' } }) {
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
        defaultValues: element
    });

    const existingUser = !!element._id;

    useEffect(() => {
        if (open) {
            reset(element);
        }
    }, [open, reset]);

    const onSubmit = (data) => {
        const userData = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
        }
        if (!existingUser) {
            userData.password = data.password;
        }

        if (!existingUser) {
            createUser(userData.email, userData.firstName, userData.lastName, userData.password)
                .then((res) => {
                    receiveResponse(res);
                    getData();
                    onClose();
                });
        } else {
            editUser(element.email, userData.email, userData.firstName, userData.lastName)
                .then((res) => {
                    receiveResponse(res);
                    getData();
                    onClose();
                });
        }
    };

    const formRef = useRef(null);
    
    const handleSaveClick = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    const email = watch("email");
    const password = watch("password");
    const firstName = watch("firstName");
    const lastName = watch("lastName");

    return (
        <Dialog open={open} onClose={onClose} fullScreen>
            <DialogTitle>
                {title}
                <div style={{ float: 'right', display: 'flex' }}>
                    <button
                        type="button"
                        className='fa-solid fa-floppy-disk admin-action-button'
                        style={{ display: 'inline-block', justifySelf: 'right', fontSize: '1.5rem', marginTop: '-0.05rem', marginRight: '20px' }}
                        onClick={handleSaveClick}
                    />
                    <button
                        type="button"
                        className='fa-solid fa-xmark admin-action-button'
                        style={{ display: 'inline-block', justifySelf: 'right', fontSize: '1.5rem', marginTop: '-0.05rem' }}
                        onClick={onClose}
                    />
                </div>
            </DialogTitle>
            <DialogContent>
                <form className="user-form" onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <div className="form-column">
                        <FormField
                            title="Email*"
                            type="text"
                            value={email}
                            error={errors.email && errors.email.message}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address"
                                },
                                maxLength: {
                                    value: 320,
                                    message: "Email must be at most 320 characters long"
                                }
                            })}
                        />
                        {!existingUser && (
                            <FormField
                                title="Password*"
                                type="text"
                                value={password}
                                error={errors.password && errors.password.message}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters long"
                                    },
                                    maxLength: {
                                        value: 64,
                                        message: "Password must be at most 64 characters long"
                                    }
                                })}
                            />
                        )}
                        <div className='form-row'>
                            <div className='flex-1'>
                                <FormField
                                    title="First Name"
                                    type="text"
                                    value={firstName}
                                    error={errors.firstName && errors.firstName.message}
                                    {...register("firstName", {
                                        maxLength: {
                                            value: 100,
                                            message: "First Name must be at most 100 characters long"
                                        }
                                    })}
                                />
                            </div>
                            <div className='flex-1'>
                                <FormField
                                    title="Last Name"
                                    type="text"
                                    value={lastName}
                                    error={errors.lastName && errors.lastName.message}
                                    {...register("lastName", {
                                        maxLength: {
                                            value: 100,
                                            message: "Last Name must be at most 100 characters long"
                                        }
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteDialog({ open, onClose, title, adminPage, getData, element }) {
    const handleDelete = () => {
        switch (adminPage) {
            case 'Cues':

                break;
            case 'Accessories':
                deleteAccessory(element._id)
                    .then((res) => {
                        receiveResponse(res);
                        getData();
                        onClose();
                    });
                break;
            case 'Materials':
                if (element.commonName) {
                    // It's a wood material
                    deleteWood(element._id)
                        .then((res) => {
                            receiveResponse(res);
                            getData();
                            onClose();
                        })
                } else if (element.crystalName) {
                    // It's a crystal material
                    deleteCrystal(element._id)
                        .then((res) => {
                            receiveResponse(res);
                            getData();
                            onClose();
                        })
                } else {
                    console.error("Unknown material type");
                    onClose();
                }
                break;
            case 'Users':
                deleteUser(element.email)
                    .then((res) => {
                        receiveResponse(res);
                        getData();
                        onClose();
                    });
                break;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} >
            <DialogTitle>
                {title}
                <button
                    className='fa-solid fa-xmark admin-action-button'
                    style={{ display: 'inline-block', float: 'right', justifySelf: 'right', fontSize: '1.5rem', marginTop: '-0.05rem', marginLeft: '10px' }}
                    onClick={onClose}
                />
            </DialogTitle>
            <DialogContent>
                <div className="form-column">
                    <DialogContentText>
                        This action is irreversible. Are you sure you want to proceed?
                    </DialogContentText>
                    <DialogActions>
                        <div className='form-row'>
                            <DefaultButton text={"Cancel"} onClick={onClose} />
                            <DefaultButton text={"Confirm"} onClick={handleDelete} />
                        </div>
                    </DialogActions>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function PasswordDialog({ open, onClose, title, element = { password: '', firstName: '' } }) {
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
        defaultValues: element
    });

    useEffect(() => {
        if (open) {
            reset(element);
        }
    }, [open, reset]);

    const onSubmit = (data) => {
        changePassword(element.email, data.password)
            .then((res) => {
                receiveResponse(res);
            });
        onClose();
    };

    const formRef = useRef(null);
    
    const handleSaveClick = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    const firstName = element.firstName;
    const password = watch("password");

    return (
        <Dialog open={open} onClose={onClose} >
            <DialogTitle>
                {title} {firstName && `'${firstName}'`}
                <div style={{ float: 'right', display: 'flex' }}>
                    <button
                        type="button"
                        className='fa-solid fa-floppy-disk admin-action-button'
                        style={{ display: 'inline-block', justifySelf: 'right', fontSize: '1.5rem', marginTop: '-0.05rem', marginRight: '20px' }}
                        onClick={handleSaveClick}
                    />
                    <button
                        type="button"
                        className='fa-solid fa-xmark admin-action-button'
                        style={{ display: 'inline-block', justifySelf: 'right', fontSize: '1.5rem', marginTop: '-0.05rem' }}
                        onClick={onClose}
                    />
                </div>
            </DialogTitle>
            <DialogContent>
                <form className="password-form" onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <div className="form-column">
                        <FormField
                            title="Password"
                            type="text"
                            value={password}
                            error={errors.password && errors.password.message}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters long"
                                },
                                maxLength: {
                                    value: 64,
                                    message: "Password must be at most 64 characters long"
                                }
                            })}
                        />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

const tableProps = {
    positionActionsColumn: 'last',
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    positionGlobalFilter: 'left',
    initialState: {
        showGlobalFilter: true,
        pagination: {
            pageSize: 10,
        },
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    muiSearchTextFieldProps: {
        size: 'small',
        variant: 'outlined',
    },
    muiPaginationProps: {
        rowsPerPageOptions: [5, 10, 20, 30, 40, 50],
        shape: 'rounded',
        variant: 'outlined',
    },
};