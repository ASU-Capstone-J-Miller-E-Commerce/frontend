import React, { useEffect, useState, useRef } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { set, useForm } from 'react-hook-form';
import { FormField, FormTextArea, FormSelect, DefaultToggle, FormMultiSelect } from '../../util/Inputs';
import { DefaultButton } from '../../util/Buttons';
import { getAdminUsers, createUser, editUser, changePassword, deleteUser, getAdminAccessories, createAccessory, editAccessory, deleteAccessory, getAdminMaterials, createWood, editWood, createCrystal, editCrystal, deleteCrystal, deleteWood, getAdminCues, createCue, editCue, deleteCue, deleteImages } from '../../../util/requests';
import { receiveResponse } from '../../../util/notifications';
import { AdminSkeletonLoader } from '../../util/Util';
import { useSelector } from 'react-redux';
import { ImageUploader } from '../../util/Util';
import {
    CUE_BASIC_MATERIAL_OPTIONS,
    COLOR_OPTIONS,
    METAPHYSICAL_OPTIONS,
    STATUS_OPTIONS_AVAILABLE,
    STATUS_OPTIONS_CUE,
    TIP_SIZE_OPTIONS,
    SHAFT_MATERIAL_OPTIONS,
    SHAFT_TAPER_OPTIONS,
    JOINT_PIN_SIZE_OPTIONS,
    JOINT_MATERIAL_OPTIONS,
    WRAP_TYPE_OPTIONS,
    BASIC_SIZE_OPTIONS,
    PSYCHOLOGICAL_CORRESPONDENCE_OPTIONS,
    CRYSTAL_CATEGORY_OPTIONS,
    IRISH_LINEN_COLOR_OPTIONS,
    LEATHER_COLOR_OPTIONS,
    RING_TYPE_OPTIONS
} from '../../../util/globalConstants';

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

    const getData = async (pageOverride = null) => {
        setLoading(true);

        const currentPage = pageOverride || adminPage;
        switch (currentPage) {
            case 'Cues':
                getAdminCues()
                    .then((res) => {
                        setLoading(false);
                        setCueData(res.data);
                    })
                    .catch((err) => {
                        setLoading(false);
                    });
                break;
            case 'Accessories':
                getAdminAccessories()
                    .then((res) => {
                        setLoading(false);
                        setAccessoryData(res.data);
                    })
                    .catch((err) => {
                        setLoading(false);
                    });
                break;
            case 'Materials':
                if (pageOverride && materialData !== null) return setLoading(false);
                getAdminMaterials()
                    .then((res) => {
                        setLoading(false);
                        setMaterialData(res.data);
                    })
                    .catch((err) => {
                        setLoading(false);
                    });
                break;
            case 'Users':
                getAdminUsers()
                    .then((res) => {
                        setLoading(false);
                        setUserData(res.data);
                    })
                    .catch((err) => {
                        setLoading(false);
                    });
                break;
            default:
                setLoading(false);
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

    const setDialogPropsHandler = (newProps) => {
        setDialogProps(prev => ({ ...prev, ...newProps }));
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
            {adminPage === 'Cues' && <CueDialog open={dialogOpen} onClose={handleDialogClose} setDialogProps={setDialogPropsHandler} getData={getData} cueData={cueData} materialData={materialData} {...dialogProps} />}
            {adminPage === 'Accessories' && <AccessoryDialog open={dialogOpen} onClose={handleDialogClose} setDialogProps={setDialogPropsHandler} getData={getData} {...dialogProps} />}
            {adminPage === 'Materials' && <MaterialDialog open={dialogOpen} onClose={handleDialogClose} setDialogProps={setDialogPropsHandler} getData={getData} {...dialogProps} />}
            {adminPage === 'Users' && <UserDialog open={dialogOpen} onClose={handleDialogClose} setDialogProps={setDialogPropsHandler} getData={getData} {...dialogProps} />}
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
    if (loading) {
        return <AdminSkeletonLoader />;
    }

    switch (adminPage) {
        case 'Cues':
            return <CuesTable data={cueData} onEditClick={onEditClick} onDeleteClick={onDeleteClick} />;
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

function CuesTable({ data, onEditClick, onDeleteClick }) {
    const columns = [
        {
            accessorKey: 'cueNumber',
            header: 'Cue Number',
            id: 'cueNumber',
        },
        {
            accessorKey: 'name',
            header: 'Name',
            id: 'cueName',
        },
        {
            header: 'Price',
            accessorFn: (row) => row.price ? `$${row.price}` : '',
            id: 'cuePrice',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            id: 'cueStatus',
        },
        {
            id: 'actions1',
            header: 'Actions',
            Cell: ({ row }) => (
                <div className='admin-actions'>
                    <button
                        className='fa-solid fa-pencil admin-action-button'
                        onClick={() => onEditClick({ element: row.original, title: `Edit Cue '${row.original.name}'` })}
                    />
                    <button
                        className='fa-solid fa-trash admin-action-button'
                        onClick={() => onDeleteClick({ element: row.original, title: `Delete Cue '${row.original.name}'` })}
                    />
                </div>
            ),
        },
    ];

    return (
        <div>
            <h3 className="admin-page-header">Cues</h3>
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
            id: 'accessoryNumber',
        },
        {
            accessorKey: 'name',
            header: 'Name',
            id: 'accessoryName',
        },
        {
            header: 'Price',
            accessorFn: (row) => row.price ? `$${row.price}` : '',
            id: 'accessoryPrice',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            id: 'accessoryStatus',
        },
        {
            id: 'actions2',
            header: 'Actions',
            Cell: ({ row }) => (
                <div className='admin-actions'>
                    <button
                        className='fa-solid fa-pencil admin-action-button'
                        onClick={() => onEditClick({ element: row.original, title: `Edit Accessory '${row.original.name}'` })}
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
            <h3 className="admin-page-header">Accessories</h3>
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
            id: 'materialTier',
        },
        {
            header: 'Status',
            accessorKey: 'status',
            id: 'materialStatus',
        },
        {
            id: 'actions3',
            header: 'Actions',
            Cell: ({ row }) => (
                <div className='admin-actions'>
                    <button
                        className='fa-solid fa-pencil admin-action-button'
                        onClick={() => onEditClick({ element: row.original, title: `Edit ${row.original.commonName ? 'Wood' : 'Stone/Crystal'} '${row.original.commonName ? row.original.commonName : row.original.crystalName}'` })}
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
            <h3 className="admin-page-header">Materials</h3>
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
            id: 'userFirstName',
        },
        {
            accessorKey: 'lastName',
            header: 'Last Name',
            id: 'userLastName',
        },
        {
            accessorKey: 'email',
            header: 'Email',
            id: 'userEmail',
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
            id: 'userPassword',
        },
        {
            id: 'actions4',
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
            <h3 className="admin-page-header">Users</h3>
            <MaterialReactTable
                columns={columns}
                data={data}
                {...tableProps}
            />
        </div>
    );
}

// Add handleWrapColor to the CueDialog default element properties
function CueDialog({ open, onClose, title, getData, cueData, materialData, setDialogProps, element = {
    cueNumber: new Date().getFullYear() + '-',
    name: '',
    description: '',
    notes: '',
    price: '',
    overallWeight: '',
    overallLength: '',
    tipSize: '12.4',
    ferruleMaterial: 'Juma',
    shaftMaterial: 'Hard Maple',
    shaftTaper: 'Pro-Taper',
    jointPinSize: '3/8-10 Modified',
    jointPinMaterial: 'Stainless Steel',
    jointCollarMaterial: 'Black Juma',
    forearmMaterial: '',
    handleMaterial: '',
    handleWrapType: '',
    handleWrapColor: '',
    buttSleeveMaterial: '',
    ringType: '',
    ringsDescription: '',
    buttWeight: '',
    buttLength: '',
    buttCapMaterial: 'Juma',
    status: '',
    forearmInlayQuantity: '',
    forearmInlaySize: '',
    forearmInlayMaterial: '',
    buttsleeveInlayQuantity: '',
    buttsleeveInlaySize: '',
    buttSleeveInlayMaterial: '',
    forearmPointQuantity: '',
    forearmPointSize: '',
    forearmPointVeneerDescription: '',
    buttSleevePointQuantity: '',
    buttSleevePointSize: '',
    buttSleevePointVeneerDescription: '',
    handleInlayQuantity: '',
    handleInlaySize: '',
    handleInlayMaterial: '',
    forearmPointInlayDescription: '',
    forearmPointInlayMaterial: '',
    buttSleevePointInlayDescription: '',
    buttSleevePointInlayMaterial: '',
    forearmInlayDescription: '',
    handleInlayDescription: '',
    buttsleeveInlayDescription: '',
  }}) {
    const [includeWrap, setIncludeWrap] = useState(false);
    const [includeForearmPointVeneers, setIncludeForearmPointVeneers] = useState(false);
    const [includeButtSleevePointVeneers, setIncludeButtSleevePointVeneers] = useState(false);
    const [buttType, setButtType] = useState(false);
    const [includeForearmInlay, setIncludeForearmInlay] = useState(false);
    const [includeHandleInlay, setIncludeHandleInlay] = useState(false);
    const [includeButtSleeveInlay, setIncludeButtSleeveInlay] = useState(false);
    const [includeForearmPointInlay, setIncludeForearmPointInlay] = useState(false);
    const [includeButtSleevePointInlay, setIncludeButtSleevePointInlay] = useState(false);
    const [includeForearmPoint, setIncludeForearmPoint] = useState(false);
    const [includeButtSleevePoint, setIncludeButtSleevePoint] = useState(false);
    const [isCustomJointPinSize, setIsCustomJointPinSize] = useState(false);
    const [isCustomTipSize, setIsCustomTipSize] = useState(false);
    const [deletedUrls, setDeletedUrls] = useState([]);
    const [savedCue, setSavedCue] = useState(false);
    const [localTitle, setLocalTitle] = useState(title);
    const [isCustomFerruleMaterial, setIsCustomFerruleMaterial] = useState(false);
    const [isCustomJointCollarMaterial, setIsCustomJointCollarMaterial] = useState(false);
    const [isCustomButtCapMaterial, setIsCustomButtCapMaterial] = useState(false);

    useEffect(() => {
        setLocalTitle(title);
    }, [title]);

    const woods = materialData?.filter(item => item.commonName && item.status === "Available") || [];
    const crystals = materialData?.filter(item => item.crystalName && item.status === "Available") || [];
    

    const { register, handleSubmit, watch, formState: { errors }, reset, setValue, getValues } = useForm({
        defaultValues: element
    });

    const formRef = useRef(null);

    const getNextCueNumber = (cuesArray) => {
        const currentYear = new Date().getFullYear();
        const yearPrefix = `${currentYear}-`;

        if (!cuesArray || !cuesArray.length) return `${yearPrefix}001`;

        const cueNumbers = cuesArray
            .filter(cue => cue.cueNumber && cue.cueNumber.startsWith(yearPrefix))
            .map(cue => {
                const numPart = cue.cueNumber.substring(yearPrefix.length);
                return parseInt(numPart, 10) || 0;
            });

        const highestNum = cueNumbers.length > 0 ? Math.max(...cueNumbers) : 0;

        const nextNumber = (highestNum + 1).toString().padStart(3, '0');
        return `${yearPrefix}${nextNumber}`;
    };
    
    useEffect(() => {
        if (open) {
            getData('Materials');
            reset(element);
            setButtType(element.isFullSplice || false);
            setIncludeWrap(!!element.handleWrapType || !!element.handleWrapColor);

            // Check all forearm inlay related fields
            setIncludeForearmInlay(
                !!element.forearmInlayQuantity ||
                !!element.forearmInlaySize ||
                !!element.forearmInlayMaterial ||
                !!element.forearmInlayDescription
            );

            // Check all handle inlay related fields
            setIncludeHandleInlay(
                !!element.handleInlayQuantity ||
                !!element.handleInlaySize ||
                !!element.handleInlayMaterial ||
                !!element.handleInlayDescription
            );

            // Check all butt sleeve inlay related fields
            setIncludeButtSleeveInlay(
                !!element.buttsleeveInlayQuantity ||
                !!element.buttsleeveInlaySize ||
                !!element.buttSleeveInlayMaterial ||
                !!element.buttsleeveInlayDescription
            );

            // Check all forearm point related fields
            setIncludeForearmPoint(
                !!element.forearmPointQuantity ||
                !!element.forearmPointSize ||
                !!element.forearmPointVeneerDescription ||
                !!element.forearmPointInlayDescription ||
                !!element.forearmPointInlayMaterial
            );

            // Check all butt sleeve point related fields
            setIncludeButtSleevePoint(
                !!element.buttSleevePointQuantity ||
                !!element.buttSleevePointSize ||
                !!element.buttSleevePointVeneerDescription ||
                !!element.buttSleevePointInlayDescription ||
                !!element.buttSleevePointInlayMaterial
            );

            // Set veneer and inlay specific toggles
            setIncludeForearmPointVeneers(!!element.forearmPointVeneerDescription);
            setIncludeButtSleevePointVeneers(!!element.buttSleevePointVeneerDescription);

            // Check all forearm point inlay related fields
            setIncludeForearmPointInlay(
                !!element.forearmPointInlayDescription ||
                !!element.forearmPointInlayMaterial
            );

            // Check all butt sleeve point inlay related fields
            setIncludeButtSleevePointInlay(
                !!element.buttSleevePointInlayDescription ||
                !!element.buttSleevePointInlayMaterial
            );

            setIsCustomJointPinSize(JOINT_PIN_SIZE_OPTIONS.every(option => option.label !== element.jointPinSize));
            setIsCustomTipSize(TIP_SIZE_OPTIONS.every(option => option.label !== element.tipSize));
            setIsCustomWrapType(WRAP_TYPE_OPTIONS.every(option => option.label !== element.handleWrapType));
            setIsCustomFerruleMaterial(CUE_BASIC_MATERIAL_OPTIONS.every(option => option.commonName !== element.ferruleMaterial));
            setIsCustomJointCollarMaterial(
                CUE_BASIC_MATERIAL_OPTIONS.every(option => option.commonName !== element.jointCollarMaterial) &&
                woods.every(wood => wood._id !== element.jointCollarMaterial)
            );
            setIsCustomButtCapMaterial(typeof element.buttCapMaterial !== 'object' && CUE_BASIC_MATERIAL_OPTIONS.every(option => option.commonName !== element.buttCapMaterial));
            if (!element._id && cueData) {
                const nextCueNumber = getNextCueNumber(cueData);
                setValue('cueNumber', nextCueNumber);
            }
            setDeletedUrls([]);
            setSavedCue(!!element._id);
        }
    }, [open, reset]);

    useEffect(() => {
        // Only run when editing an existing cue AND materials have been loaded
        if (open && materialData?.length > 0 && element._id) {
            // For each material field, find the matching object from woods array
            if (element.forearmMaterial) {
                const forearmWood = woods.find(wood => wood._id === element.forearmMaterial);
                if (forearmWood) {
                    setValue('forearmMaterial', forearmWood);
                }
            }

            if (element.handleMaterial) {
                const handleWood = woods.find(wood => wood._id === element.handleMaterial);
                if (handleWood) {
                    setValue('handleMaterial', handleWood);
                }
            }

            if (element.buttSleeveMaterial) {
                const buttSleeveWood = woods.find(wood => wood._id === element.buttSleeveMaterial);
                if (buttSleeveWood) {
                    setValue('buttSleeveMaterial', buttSleeveWood);
                }
            }

            if (element.forearmInlayMaterial) {
                const forearmInlayCrystal = crystals.find(crystal => crystal._id === element.forearmInlayMaterial);
                if (forearmInlayCrystal) {
                    setValue('forearmInlayMaterial', forearmInlayCrystal);
                }
            }

            if (element.forearmPointInlayMaterial) {
                const forearmPointInlayCrystal = crystals.find(crystal => crystal._id === element.forearmPointInlayMaterial);
                if (forearmPointInlayCrystal) {
                    setValue('forearmPointInlayMaterial', forearmPointInlayCrystal);
                }
            }

            if (element.handleInlayMaterial) {
                const handleInlayCrystal = crystals.find(crystal => crystal._id === element.handleInlayMaterial);
                if (handleInlayCrystal) {
                    setValue('handleInlayMaterial', handleInlayCrystal);
                }
            }

            if (element.buttSleeveInlayMaterial) {
                const buttSleeveInlayCrystal = crystals.find(crystal => crystal._id === element.buttSleeveInlayMaterial);
                if (buttSleeveInlayCrystal) {
                    setValue('buttSleeveInlayMaterial', buttSleeveInlayCrystal);
                }
            }

            if (element.buttSleevePointInlayMaterial) {
                const buttSleevePointInlayCrystal = crystals.find(crystal => crystal._id === element.buttSleevePointInlayMaterial);
                if (buttSleevePointInlayCrystal) {
                    setValue('buttSleevePointInlayMaterial', buttSleevePointInlayCrystal);
                }
            }
        }
    }, [materialData, open, element._id]);

    const existingCue = savedCue || !!element._id;

    const onSubmit = (data) => {
        data.isFullSplice = buttType;
        data.includeWrap = includeWrap;
        console.log(data)
        if (existingCue) {
            editCue(data._id, data)
                .then((res) => {
                    receiveResponse(res);
                    getData();
                })
            if (deletedUrls.length > 0) {
                deleteImages(deletedUrls)
                    .then((res) => {
                        setDeletedUrls([]);
                    })
            }
        }
        else {
            createCue(data)
                .then((res) => {
                    receiveResponse(res);
                    getData();
                    setDialogProps(prev => ({
                        ...prev,
                        element: res.data,
                        title: `Edit Cue '${res.data.name}'`
                    }));

                    setLocalTitle(`Edit Cue '${res.data.name}'`);
                    
                    reset(res.data);
                    setSavedCue(true);
                })
        }
    };

    const handleSaveClick = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    const cueNumber = watch("cueNumber");
    const name = watch("name");
    const description = watch("description");
    const notes = watch("notes"); 
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
    const handleWrapType = watch("handleWrapType");
    const handleWrapColor = watch("handleWrapColor");
    const buttSleeveMaterial = watch("buttSleeveMaterial");
    const buttWeight = watch("buttWeight");
    const buttLength = watch("buttLength");
    const buttCapMaterial = watch("buttCapMaterial");
    const forearmPointQuantity = watch("forearmPointQuantity");
    const forearmPointSize = watch("forearmPointSize");
    const forearmPointVeneerDescription = watch("forearmPointVeneerDescription");
    const buttSleevePointQuantity = watch("buttSleevePointQuantity");
    const buttSleevePointSize = watch("buttSleevePointSize");
    const buttSleevePointVeneerDescription = watch("buttSleevePointVeneerDescription");
    const forearmInlayQuantity = watch("forearmInlayQuantity");
    const forearmInlaySize = watch("forearmInlaySize");
    const buttsleeveInlayQuantity = watch("buttsleeveInlayQuantity");
    const buttsleeveInlaySize = watch("buttsleeveInlaySize");
    const handleInlayQuantity = watch("handleInlayQuantity");
    const handleInlaySize = watch("handleInlaySize");
    const forearmPointInlayDescription = watch("forearmPointInlayDescription");
    const buttSleevePointInlayDescription = watch("buttSleevePointInlayDescription");
    const forearmInlayDescription = watch("forearmInlayDescription");
    const handleInlayDescription = watch("handleInlayDescription");
    const buttsleeveInlayDescription = watch("buttsleeveInlayDescription");
    // Add these new watches
    const ringType = watch("ringType");
    const ringsDescription = watch("ringsDescription");
    const forearmInlayMaterial = watch("forearmInlayMaterial");
    const forearmPointInlayMaterial = watch("forearmPointInlayMaterial");
    const handleInlayMaterial = watch("handleInlayMaterial");
    const buttSleeveInlayMaterial = watch("buttSleeveInlayMaterial");
    const buttSleevePointInlayMaterial = watch("buttSleevePointInlayMaterial");

    // Set default colors when wrap type changes
    const handleIncludeWrapChange = (newValue) => {
        if (newValue) {
            // Only set default values if there are no current values
            setValue("handleMaterial", '');

            // Only set defaults if no existing wrap type
            if (!handleWrapType) {
                setValue("handleWrapType", 'Irish Linen');
                setValue("handleWrapColor", 'Black w/ White');
                setIsCustomWrapType(false);
                setIsCustomColor(false);
            }
        } else {
            setValue("handleWrapType", '');
            setValue("handleWrapColor", '');
            setValue("handleCustomLeatherColor", '');
        }

        // Update the state
        setIncludeWrap(newValue);
    };

    useEffect(() => {
        if (ferruleMaterial === 'Other') {
            setValue("ferruleMaterial", "");
            setIsCustomFerruleMaterial(true);
        }
    }, [ferruleMaterial, setValue]);

    useEffect(() => {
        if (jointCollarMaterial === 'Other') {
            setValue("jointCollarMaterial", "");
            setIsCustomJointCollarMaterial(true);
        }
    }, [jointCollarMaterial, setValue]);

    useEffect(() => {
        if (buttCapMaterial === 'Other') {
            setValue("buttCapMaterial", "");
            setIsCustomButtCapMaterial(true);
        }
    }, [buttCapMaterial, setValue]);


    // Watch these values for conditional rendering
    const [isCustomColor, setIsCustomColor] = useState(false);
    
    // Check if we need to show custom color input when wrap type or color changes
    useEffect(() => {
        if (['Leather', 'Embossed Leather', 'Stacked Leather'].includes(handleWrapType) && 
            handleWrapColor === 'Other') {
            setValue("handleWrapColor", '');
            setIsCustomColor(true);
        }
    }, [handleWrapType, handleWrapColor]);
    

    // Add a state to track custom wrap type
    const [isCustomWrapType, setIsCustomWrapType] = useState(false);

    const handleWrapTypeChange = (e) => {
        const newWrapType = e.target.value;

        if (newWrapType === 'Other') {
            setIsCustomWrapType(true);
            setValue("handleWrapType", '');
            setValue("handleWrapColor", '');
        } else {
            setValue("handleWrapType", newWrapType);
            setIsCustomWrapType(false);

            // Only set default colors for new selections when the user explicitly changes the wrap type
            if (newWrapType === 'Irish Linen') {
                setValue("handleWrapColor", 'Black w/ White');
                setIsCustomColor(false);
            } else if (['Leather', 'Embossed Leather', 'Stacked Leather'].includes(newWrapType)) {
                setValue("handleWrapColor", 'Black');
                setIsCustomColor(false);
            }
        }
    };

    // Add effect to handle buttType changes
    useEffect(() => {
        if (buttType) {
            // Full Splice mode - reset butt sleeve fields and set forearm points to 4
            setValue("buttSleeveMaterial", "");
            setValue("buttsleeveInlayQuantity", "");
            setValue("buttsleeveInlaySize", "");
            setValue("buttSleeveInlayMaterial", "");
            setValue("buttsleeveInlayDescription", "");
            setValue("buttSleevePointQuantity", "");
            setValue("buttSleevePointSize", "");
            setValue("buttSleevePointVeneerDescription", "");
            setValue("buttSleevePointInlayDescription", "");
            setValue("buttSleevePointInlayMaterial", "");
            setValue("forearmPointQuantity", "4"); // Set forearm points to fixed value of 4
            
            // Reset related toggle states
            setIncludeButtSleeveInlay(false);
            setIncludeButtSleevePoint(false);
            setIncludeButtSleevePointVeneers(false);
            setIncludeButtSleevePointInlay(false);
        } else {
            // Full Splice mode - reset butt sleeve fields and set forearm points to 4
            setValue("buttSleeveMaterial", "");
            setValue("buttsleeveInlayQuantity", "");
            setValue("buttsleeveInlaySize", "");
            setValue("buttSleeveInlayMaterial", "");
            setValue("buttsleeveInlayDescription", "");
            setValue("buttSleevePointQuantity", "");
            setValue("buttSleevePointSize", "");
            setValue("buttSleevePointVeneerDescription", "");
            setValue("buttSleevePointInlayDescription", "");
            setValue("buttSleevePointInlayMaterial", "");
            setValue("forearmPointQuantity", ""); // Set forearm points to fixed value of 4

            // Reset related toggle states
            setIncludeButtSleeveInlay(false);
            setIncludeButtSleevePoint(false);
            setIncludeButtSleevePointVeneers(false);
            setIncludeButtSleevePointInlay(false);
        }
    }, [buttType, setValue]);

    // Add these effects to reset fields when toggles are changed

    // Reset forearm point fields when toggle changes
    useEffect(() => {
        if (!includeForearmPoint) {
            setValue("forearmPointQuantity", "");
            setValue("forearmPointSize", "");
            setValue("forearmPointVeneerDescription", "");
            setValue("forearmPointInlayDescription", "");
            setValue("forearmPointInlayMaterial", "");
            setIncludeForearmPointVeneers(false);
            setIncludeForearmPointInlay(false);
        }
    }, [includeForearmPoint, setValue]);

    // Reset butt sleeve point fields when toggle changes
    useEffect(() => {
        if (!includeButtSleevePoint) {
            setValue("buttSleevePointQuantity", "");
            setValue("buttSleevePointSize", "");
            setValue("buttSleevePointVeneerDescription", "");
            setValue("buttSleevePointInlayDescription", "");
            setValue("buttSleevePointInlayMaterial", "");
            setIncludeButtSleevePointVeneers(false);
            setIncludeButtSleevePointInlay(false);
        }
    }, [includeButtSleevePoint, setValue]);

    // Reset forearm inlay fields when toggle changes
    useEffect(() => {
        if (!includeForearmInlay) {
            setValue("forearmInlayQuantity", "");
            setValue("forearmInlaySize", "");
            setValue("forearmInlayMaterial", "");
            setValue("forearmInlayDescription", "");
        }
    }, [includeForearmInlay, setValue]);

    // Reset handle inlay fields when toggle changes
    useEffect(() => {
        if (!includeHandleInlay) {
            setValue("handleInlayQuantity", "");
            setValue("handleInlaySize", "");
            setValue("handleInlayMaterial", "");
            setValue("handleInlayDescription", "");
        }
    }, [includeHandleInlay, setValue]);

    // Reset butt sleeve inlay fields when toggle changes
    useEffect(() => {
        if (!includeButtSleeveInlay) {
            setValue("buttsleeveInlayQuantity", "");
            setValue("buttsleeveInlaySize", "");
            setValue("buttSleeveInlayMaterial", "");
            setValue("buttsleeveInlayDescription", "");
        }
    }, [includeButtSleeveInlay, setValue]);

    // Reset specific veneer and inlay descriptions when their toggles change
    useEffect(() => {
        if (!includeForearmPointVeneers) {
            setValue("forearmPointVeneerDescription", "");
        }
    }, [includeForearmPointVeneers, setValue]);

    useEffect(() => {
        if (!includeForearmPointInlay) {
            setValue("forearmPointInlayDescription", "");
            setValue("forearmPointInlayMaterial", "");
        }
    }, [includeForearmPointInlay, setValue]);

    useEffect(() => {
        if (!includeButtSleevePointVeneers) {
            setValue("buttSleevePointVeneerDescription", "");
        }
    }, [includeButtSleevePointVeneers, setValue]);

    useEffect(() => {
        if (!includeButtSleevePointInlay) {
            setValue("buttSleevePointInlayDescription", "");
            setValue("buttSleevePointInlayMaterial", "");
        }
    }, [includeButtSleevePointInlay, setValue]);

    // Add effect to handle joint pin size changes
    useEffect(() => {
        if (jointPinSize === 'Other') {
            setValue("jointPinSize", "");
            setIsCustomJointPinSize(true);
        }
    }, [jointPinSize, setValue]);

    // Add effect to handle tip size changes
    useEffect(() => {
    if (tipSize === 'Other') {
        setValue("tipSize", "");
        setIsCustomTipSize(true);
    }
    }, [tipSize, setValue]);

    return (
        <Dialog open={open} onClose={onClose} fullScreen>
            <DialogTitle style={dialogTitleStyle}>
                {localTitle}
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
                            <h1 className="dialog-header1">General Attributes</h1>
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
                                <FormTextArea
                                    title="Notes"
                                    value={notes}
                                    {...register("notes")}
                                />
                                <FormSelect
                                    title="Status*"
                                    value={status}
                                    error={errors.status && errors.status.message}
                                    options={STATUS_OPTIONS_CUE}
                                    displayKey="label"
                                    valueKey="label"
                                    {...register("status", {
                                        required: "Status is required"
                                    })}
                                />
                            </div>
                        </div>
                        <div>
                            <h1 className="dialog-header1">Shaft</h1>
                            <div>
                                <div className='form-row'>
                                    <div className='flex-1'>
                                        <FormSelect
                                            title="Shaft Material"
                                            value={shaftMaterial}
                                            options={SHAFT_MATERIAL_OPTIONS}
                                            displayKey="label"
                                            valueKey="label"
                                            {...register("shaftMaterial")}
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <FormSelect
                                            title="Shaft Taper"
                                            value={shaftTaper}
                                            options={SHAFT_TAPER_OPTIONS} // Use the global constant instead of sizeOptions
                                            displayKey="label"
                                            valueKey="label"
                                            {...register("shaftTaper")}
                                        />
                                    </div>
                                    {!isCustomTipSize && <div className='flex-1'>
                                        <FormSelect
                                            title="Tip Size (mm)"
                                            value={tipSize}
                                            options={TIP_SIZE_OPTIONS} // Use the global constant here
                                            displayKey="label"
                                            valueKey="label"
                                            {...register("tipSize")}
                                        />
                                    </div>}
                                </div>
                                {isCustomTipSize && <div className='form-row'>
                                    <div className='flex-1'>
                                        <FormTextArea
                                            title="Custom Tip Size Description"
                                            value={tipSize}
                                            {...register("tipSize")}
                                        />
                                    </div>
                                </div>}
                            </div>
                            <div>
                                <h3 className="dialog-header3">Ferrule</h3>
                                <div className='form-row'>
                                    <div className='flex-1'>
                                        {isCustomFerruleMaterial ? (
                                            <FormTextArea
                                                title="Custom Ferrule Material"
                                                value={ferruleMaterial}
                                                {...register("ferruleMaterial")}
                                            />
                                        ) : (
                                            <FormSelect
                                                title="Ferrule Material"
                                                value={ferruleMaterial}
                                                options={CUE_BASIC_MATERIAL_OPTIONS}
                                                displayKey="commonName"
                                                valueKey="_id"
                                                {...register("ferruleMaterial")}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='form-row'>
                                <h1 className="dialog-header1">Butt</h1>
                                <DefaultToggle titleOn={"Full Splice"} titleOff={"Standard"} onChange={setButtType} value={buttType} />
                            </div>

                            <div className='form-column'> 
                                {/* Butt Attributes */}
                                <div>
                                    <h2 className="dialog-header2">General Attributes</h2>
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
                                    <div>
                                        <h3 className="dialog-header3">Joint Pin</h3>
                                        {isCustomJointPinSize && <div className='form-row'>
                                            <div className='flex-1'>
                                                <FormTextArea
                                                    title="Custom Joint Pin Size Description"
                                                    value={jointPinSize}
                                                    {...register("jointPinSize")}
                                                />
                                            </div>
                                        </div>}
                                        <div className='form-row'>
                                            {!isCustomJointPinSize && <div className='flex-1'>
                                                <FormSelect
                                                    title="Joint Pin Size (in)"
                                                    value={jointPinSize}
                                                    options={JOINT_PIN_SIZE_OPTIONS}
                                                    displayKey="label"
                                                    valueKey="label"
                                                    {...register("jointPinSize")}
                                                />
                                            </div>}
                                            <div className='flex-1'>
                                                <FormSelect
                                                    title="Joint Pin Material"
                                                    value={jointPinMaterial}
                                                    options={JOINT_MATERIAL_OPTIONS}
                                                    displayKey="label"
                                                    valueKey="label"
                                                    {...register("jointPinMaterial")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="dialog-header3">Joint Collar</h3>
                                        <div className='form-row'>
                                            <div className='flex-1'>
                                                {isCustomJointCollarMaterial ? (
                                                    <FormTextArea
                                                        title="Custom Joint Collar Material"
                                                        value={jointCollarMaterial}
                                                        {...register("jointCollarMaterial")}
                                                    />
                                                ) : (
                                                    <FormSelect
                                                        title="Joint Collar Material"
                                                        value={jointCollarMaterial}
                                                        options={[...CUE_BASIC_MATERIAL_OPTIONS, ...woods]}
                                                        displayKey="commonName"
                                                        valueKey="_id"
                                                        {...register("jointCollarMaterial")}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="dialog-header3">Butt Cap</h3>
                                        <div className='form-row'>
                                            <div className='flex-1'>
                                                {isCustomButtCapMaterial ? (
                                                    <FormTextArea
                                                        title="Custom Butt Cap Material"
                                                        value={buttCapMaterial}
                                                        {...register("buttCapMaterial")}
                                                    />
                                                ) : (
                                                    <FormSelect
                                                        title="Butt Cap Material"
                                                        value={buttCapMaterial}
                                                        options={CUE_BASIC_MATERIAL_OPTIONS}
                                                        displayKey="commonName"
                                                        valueKey="_id"
                                                        {...register("buttCapMaterial")}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Forearm Attributes */}
                                <div>
                                    <h2 className="dialog-header2">Forearm Attributes</h2>
                                    <div>
                                        <div className='form-row'>
                                            <div className='flex-1'>
                                                <FormSelect
                                                    title="Forearm Material"
                                                    value={forearmMaterial}
                                                    options={woods}
                                                    displayKey="commonName"
                                                    valueKey="_id"
                                                    {...register("forearmMaterial", {
                                                        setValueAs: value => {
                                                            return typeof value === 'object' && value?._id ? value._id : value;
                                                        },
                                                        value: forearmMaterial // Make sure this value is passed to the select
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='form-row'>
                                            <h3 className="dialog-header3">Forearm Inlay</h3>
                                            <DefaultToggle titleOn={"Include Forearm Inlays"} titleOff={"Exclude Forearm Inlays"} onChange={setIncludeForearmInlay} value={includeForearmInlay} />
                                        </div>
                                        {includeForearmInlay && (
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
                                                        valueKey="label"
                                                        {...register("forearmInlaySize")}
                                                    />
                                                </div>
                                                <div className='flex-1'>
                                                    <FormSelect
                                                        title="Forearm Inlay Material"
                                                        value={forearmInlayMaterial}
                                                        options={crystals}
                                                        displayKey="crystalName"
                                                        valueKey="_id"
                                                        {...register("forearmInlayMaterial", {
                                                            setValueAs: value => {
                                                                return typeof value === 'object' && value?._id ? value._id : value;
                                                            },
                                                            value: forearmInlayMaterial
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {includeForearmInlay && (
                                            <div className='form-row'>
                                                <div className='flex-1'>
                                                    <FormTextArea
                                                        title="Forearm Inlay Description"
                                                        value={forearmInlayDescription}
                                                        {...register("forearmInlayDescription")}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Moved Forearm Point here */}
                                    <div>
                                        <div className='form-row'>
                                            <h3 className="dialog-header3">Forearm Point</h3>
                                            <DefaultToggle titleOn={"Include Forearm Points"} titleOff={"Exclude Forearm Points"} onChange={setIncludeForearmPoint} value={includeForearmPoint} />
                                            {includeForearmPoint && <DefaultToggle titleOn={"Include Forearm Point Veneers"} titleOff={"Exclude Forearm Point Veneers"} onChange={setIncludeForearmPointVeneers} value={includeForearmPointVeneers} />}
                                            {includeForearmPoint && <DefaultToggle titleOn={"Include Forearm Point Inlays"} titleOff={"Exclude Forearm Point Inlays"} onChange={setIncludeForearmPointInlay} value={includeForearmPointInlay} />}
                                        </div>
                                        {includeForearmPoint && ( <>
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
                                                        valueKey="label"
                                                        {...register("forearmPointSize")}
                                                    />
                                                </div>
                                            </div>
                                            {includeForearmPointVeneers &&<div className='form-row'>
                                                <div className='flex-1'>
                                                    <FormTextArea
                                                        title="Forearm Point Veneer Description"
                                                        value={forearmPointVeneerDescription}
                                                        {...register("forearmPointVeneerDescription")}
                                                    />
                                                </div>
                                            </div>}
                                            {includeForearmPointInlay && (
                                                <div className='form-row'>
                                                    <div className='flex-1'>
                                                        <FormSelect
                                                            title="Forearm Point Inlay Material"
                                                            value={forearmPointInlayMaterial}
                                                            options={crystals}
                                                            displayKey="crystalName"
                                                            valueKey="_id"
                                                            {...register("forearmPointInlayMaterial", {
                                                                setValueAs: value => {
                                                                    return typeof value === 'object' && value?._id ? value._id : value;
                                                                },
                                                                value: forearmPointInlayMaterial
                                                            })}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {includeForearmPointInlay && (
                                                <div className='form-row'>
                                                    <div className='flex-1'>
                                                        <FormTextArea
                                                            title="Forearm Point Inlay Description"
                                                            value={forearmPointInlayDescription}
                                                            {...register("forearmPointInlayDescription")}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </>)}
                                    </div>
                                </div>

                                {/* Handle Attributes */}
                                <div>
                                    <div className='form-row'>
                                        <h2 className="dialog-header2">Handle Attributes</h2>
                                        <DefaultToggle titleOn={"Include Handle Wrap"} titleOff={"Exclude Handle Wrap"} onChange={handleIncludeWrapChange} value={includeWrap} />
                                    </div>
                                    
                                    <div className='form-row'>
                                        {includeWrap ? (
                                            <>
                                                <div className='flex-1'>
                                                    {isCustomWrapType ? (
                                                        <FormTextArea
                                                            title="Custom Wrap Type"
                                                            type="text"
                                                            value={handleWrapType}
                                                            {...register("handleWrapType")}
                                                        />
                                                    ) : (
                                                        <FormSelect
                                                            title="Handle Wrap Type"
                                                            value={handleWrapType}
                                                            options={WRAP_TYPE_OPTIONS}
                                                            displayKey="label"
                                                            valueKey="label"
                                                            onChange={handleWrapTypeChange}
                                                        />
                                                    )}
                                                </div>

                                                {/* Only show standard color selector in the same row */}
                                                {!isCustomWrapType && !isCustomColor && (
                                                    <div className='flex-1'>
                                                        {handleWrapType === 'Irish Linen' ? (
                                                            <FormSelect
                                                                title="Wrap Color"
                                                                value={handleWrapColor}
                                                                options={IRISH_LINEN_COLOR_OPTIONS}
                                                                displayKey="label"
                                                                valueKey="label"
                                                                {...register("handleWrapColor")}
                                                            />
                                                        ) : ['Leather', 'Embossed Leather', 'Stacked Leather'].includes(handleWrapType) ? (
                                                            <FormSelect
                                                                title="Wrap Color"
                                                                value={handleWrapColor}
                                                                options={LEATHER_COLOR_OPTIONS}
                                                                displayKey="label"
                                                                valueKey="label"
                                                                {...register("handleWrapColor")}
                                                            />
                                                        ) : (
                                                            <FormField
                                                                title="Wrap Color/Description"
                                                                type="text"
                                                                value={handleWrapColor}
                                                                {...register("handleWrapColor")}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className='flex-1'>
                                                <FormSelect
                                                    title="Handle Material"
                                                    value={handleMaterial}
                                                    options={woods}
                                                    displayKey="commonName"
                                                    valueKey="_id"
                                                    {...register("handleMaterial", {
                                                        setValueAs: value => {
                                                            return typeof value === 'object' && value?._id ? value._id : value;
                                                        },
                                                        value: handleMaterial
                                                    })}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Add custom color in its own row */}
                                    {includeWrap && !isCustomWrapType && isCustomColor && (
                                        <div className='form-row'>
                                            <div className='flex-1'>
                                                <FormTextArea
                                                    title="Custom Leather Color"
                                                    type="text"
                                                    value={handleWrapColor}
                                                    {...register("handleWrapColor")}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Move Handle Inlay inside here instead of as a separate section */}
                                    <div className='form-row'>
                                        <h3 className="dialog-header3">Handle Inlay</h3>
                                        <DefaultToggle titleOn={"Include Handle Inlays"} titleOff={"Exclude Handle Inlays"} onChange={setIncludeHandleInlay} value={includeHandleInlay} />
                                    </div>
                                    {includeHandleInlay && (
                                        <div className='form-row'>
                                            <div className='flex-1'>
                                                <FormField
                                                    title="Quantity"
                                                    type="number"
                                                    value={handleInlayQuantity}
                                                    {...register("handleInlayQuantity")}
                                                />
                                            </div>
                                            <div className='flex-1'>
                                                <FormSelect
                                                    title="Size"
                                                    value={handleInlaySize}
                                                    options={BASIC_SIZE_OPTIONS}
                                                    displayKey="label"
                                                    valueKey="label"
                                                    {...register("handleInlaySize")}
                                                />
                                            </div>
                                            <div className='flex-1'>
                                                <FormSelect
                                                    title="Handle Inlay Material"
                                                    value={handleInlayMaterial}
                                                    options={crystals}
                                                    displayKey="crystalName"
                                                    valueKey="_id"
                                                    {...register("handleInlayMaterial", {
                                                        setValueAs: value => {
                                                            return typeof value === 'object' && value?._id ? value._id : value;
                                                        },
                                                        value: handleInlayMaterial
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {includeHandleInlay && (
                                        <div className='form-row'>
                                            <div className='flex-1'>
                                                <FormTextArea
                                                    title="Handle Inlay Description"
                                                    value={handleInlayDescription}
                                                    {...register("handleInlayDescription")}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Butt Sleeve Attributes */}
                                {!buttType && (<div>
                                    <h2 className="dialog-header2">Butt Sleeve Attributes</h2>
                                    <div>
                                        <div className='form-row'>
                                            <div className='flex-1'>
                                                <FormSelect
                                                    title="Butt Sleeve Material"
                                                    value={buttSleeveMaterial}
                                                    options={woods}
                                                    displayKey="commonName"
                                                    valueKey="_id"
                                                    {...register("buttSleeveMaterial", {
                                                        setValueAs: value => {
                                                            return typeof value === 'object' && value?._id ? value._id : value;
                                                        },
                                                        value: buttSleeveMaterial
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='form-row'>
                                            <h3 className="dialog-header3">Buttsleeve Inlay</h3>
                                            <DefaultToggle titleOn={"Include Butt Sleeve Inlay"} titleOff={"Exclude Butt Sleeve Inlay"} onChange={setIncludeButtSleeveInlay} value={includeButtSleeveInlay} />
                                        </div>
                                        {includeButtSleeveInlay && (
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
                                                        valueKey="label"
                                                        {...register("buttsleeveInlaySize")}
                                                    />
                                                </div>
                                                <div className='flex-1'>
                                                    <FormSelect
                                                        title="Butt Sleeve Inlay Material"
                                                        value={buttSleeveInlayMaterial}
                                                        options={crystals}
                                                        displayKey="crystalName"
                                                        valueKey="_id"
                                                        {...register("buttSleeveInlayMaterial", {
                                                            setValueAs: value => {
                                                                return typeof value === 'object' && value?._id ? value._id : value;
                                                            },
                                                            value: buttSleeveInlayMaterial
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {includeButtSleeveInlay && (
                                            <div className='form-row'>
                                                <div className='flex-1'>
                                                    <FormTextArea
                                                        title="Butt Sleeve Inlay Description"
                                                        value={buttsleeveInlayDescription}
                                                        {...register("buttsleeveInlayDescription")}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Moved Butt Sleeve Point here */}
                                    <div>
                                        <div className='form-row'>
                                            <h3 className="dialog-header3">Butt Sleeve Point</h3>
                                            <DefaultToggle titleOn={"Include Butt Sleeve Points"} titleOff={"Exclude Butt Sleeve Points"} onChange={setIncludeButtSleevePoint} value={includeButtSleevePoint} />
                                            {includeButtSleevePoint && <DefaultToggle titleOn={"Include Butt Sleeve Point Veneers"} titleOff={"Exclude  Butt Sleeve Point Veneers"} onChange={setIncludeButtSleevePointVeneers} value={includeButtSleevePointVeneers} />}
                                            {includeButtSleevePoint && <DefaultToggle titleOn={"Include Butt Sleeve Point Inlays"} titleOff={"Exclude Butt Sleeve Point Inlays"} onChange={setIncludeButtSleevePointInlay} value={includeButtSleevePointInlay} />}
                                        </div>
                                        
                                        {includeButtSleevePoint && (<>
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
                                                        valueKey="label"
                                                        {...register("buttSleevePointSize")}
                                                    />
                                                </div>
                                            </div>
                                            {includeButtSleevePointVeneers &&<div className='form-row'>
                                                <div className='flex-1'>
                                                    <FormTextArea
                                                        title="Butt Sleeve Point Veneer Description"
                                                        value={buttSleevePointVeneerDescription}
                                                        {...register("buttSleevePointVeneerDescription")}
                                                    />
                                                </div>
                                            </div>}
                                            {includeButtSleevePointInlay && (
                                                <div className='form-row'>
                                                    <div className='flex-1'>
                                                        <FormSelect
                                                            title="Butt Sleeve Point Inlay Material"
                                                            value={buttSleevePointInlayMaterial}
                                                            options={crystals}
                                                            displayKey="crystalName"
                                                            valueKey="_id"
                                                            {...register("buttSleevePointInlayMaterial", {
                                                                setValueAs: value => {
                                                                    return typeof value === 'object' && value?._id ? value._id : value;
                                                                },
                                                                value: buttSleevePointInlayMaterial
                                                            })}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {includeButtSleevePointInlay && (
                                                <div className='form-row'>
                                                    <div className='flex-1'>
                                                        <FormTextArea
                                                            title="Butt Sleeve Point Inlay Description"
                                                            value={buttSleevePointInlayDescription}
                                                            {...register("buttSleevePointInlayDescription")}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </>)}
                                    </div>
                                </div>)}
                            </div>
                        </div>
                        <div>
                            <h1 className="dialog-header1">Rings</h1>
                            <div className='form-row'>
                                <div className='flex-1'>
                                    <FormSelect
                                        title="Ring Type"
                                        value={ringType}
                                        options={RING_TYPE_OPTIONS}
                                        displayKey="label"
                                        valueKey="label"
                                        {...register("ringType")}
                                    />
                                </div>
                            </div>
                            <div className='form-row'>
                                <div className='flex-1'>
                                    <FormTextArea
                                        title="Rings Description"
                                        value={ringsDescription}
                                        {...register("ringsDescription")}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogImageSection
                            folder={'cues'}
                            existingItem={existingCue}
                            imageUrls={getValues('imageUrls') || []}
                            onImageDelete={(imageUrl) => {
                                setDeletedUrls(prev => [...prev, imageUrl]);
                                const newImageUrls = (getValues('imageUrls') || []).filter(url => url !== imageUrl);
                                setValue('imageUrls', newImageUrls);
                            }}
                            onImageUpload={(imageUrls, isReorder) => {
                                if (isReorder) {
                                    setValue('imageUrls', imageUrls);
                                } else {
                                    // Add new images to the existing array (for uploading new images)
                                    const currentImageUrls = getValues('imageUrls') || [];
                                    const updatedImageUrls = [...currentImageUrls, ...imageUrls];
                                    setValue('imageUrls', updatedImageUrls);
                                    handleSubmit(onSubmit)();
                                }
                            }}
                        />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function AccessoryDialog({ open, onClose, title: initialTitle, getData, setDialogProps, element = { name: '', description: '', price: '', accessoryNumber: '', status: '', imageUrls: [] } }) {
    const [deletedUrls, setDeletedUrls] = useState([]);
    const [savedAccessory, setSavedAccessory] = useState(false);
    const [localTitle, setLocalTitle] = useState(initialTitle);
    
    const { register, handleSubmit, watch, formState: { errors }, reset, setValue, getValues } = useForm({
        defaultValues: element
    });

    // Update local title when prop changes
    useEffect(() => {
        setLocalTitle(initialTitle);
    }, [initialTitle]);

    const existingAccessory = savedAccessory || !!element._id;
    
    const formRef = useRef(null);

    useEffect(() => {
        if (open) {
            reset(element);
            setDeletedUrls([]);
            setSavedAccessory(!!element._id);
        }
    }, [open, reset]);

    const onSubmit = (data) => {
        if (existingAccessory) {
            editAccessory(data._id, data.accessoryNumber, data.name, data.description, data.price, data.status, data.imageUrls)
                .then((res) => {
                    receiveResponse(res);
                    getData();
                })
            if (deletedUrls.length > 0) {
                deleteImages(deletedUrls)
                    .then((res) => {
                        setDeletedUrls([]);
                    })
            }
        } else {
            createAccessory(data.accessoryNumber, data.name, data.description, data.price, data.status)
                .then((res) => {
                    receiveResponse(res);
                    getData();

                    setDialogProps(prev => ({
                        ...prev,
                        element: res.data,
                        title: `Edit Accessory '${res.data.name}'`
                    }));
                    
                    setLocalTitle(`Edit Accessory '${res.data.name}'`);

                    reset(res.data);
                    setSavedAccessory(true);
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
            <DialogTitle style={dialogTitleStyle}>
                {localTitle} {/* Use local title here */}
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
            <DialogContent style={dialogContentStyle}>
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
                        {/* Image section */}
                        <DialogImageSection
                            folder={'accessories'}
                            existingItem={existingAccessory}
                            imageUrls={getValues('imageUrls') || []}
                            onImageDelete={(imageUrl) => {
                                setDeletedUrls(prev => [...prev, imageUrl]);
                                const newImageUrls = (getValues('imageUrls') || []).filter(url => url !== imageUrl);
                                setValue('imageUrls', newImageUrls);
                            }}
                            onImageUpload={(imageUrls, isReorder) => {
                                if (isReorder) {
                                    setValue('imageUrls', imageUrls);
                                } else {
                                    // Add new images to the existing array (for uploading new images)
                                    const currentImageUrls = getValues('imageUrls') || [];
                                    const updatedImageUrls = [...currentImageUrls, ...imageUrls];
                                    setValue('imageUrls', updatedImageUrls);
                                    handleSubmit(onSubmit)();
                                }
                            }}
                        />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function MaterialDialog({ open, onClose, title: initialTitle, getData, setDialogProps, element = false }) {
    const [materialType, setMaterialType] = useState('');
    const [deletedUrls, setDeletedUrls] = useState([]);
    const [savedMaterial, setSavedMaterial] = useState(false);
    const [localTitle, setLocalTitle] = useState(initialTitle);

    const getDefaultValues = (type) => {
        const commonDefaults = {
            status: '',
            tier: '',
            colors: [],
            imageUrls: [],
        };

        if (type === 'wood') {
            return {
                ...commonDefaults,
                commonName: '',
                alternateName1: '',
                alternateName2: '',
                scientificName: '',
                description: '',
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

    const { register, handleSubmit, watch, formState: { errors }, reset, setValue, getValues } = useForm({
        defaultValues: element || getDefaultValues('')
    });

    // Update local title when prop changes
    useEffect(() => {
        setLocalTitle(initialTitle);
    }, [initialTitle]);
    
    const existingMaterial = savedMaterial || !!element._id;
    
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
                setSavedMaterial(true);
            } else {
                // New material
                setMaterialType('');
                reset(getDefaultValues());
                setSavedMaterial(false);
            }
            setDeletedUrls([]);
        }
    }, [open, reset]);

    useEffect(() => {
        if (materialType && !existingMaterial) {
            reset({ ...getDefaultValues(materialType) });
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
                    data.metaphysicalTags,
                    data.imageUrls,
                )
                    .then(res => {
                        receiveResponse(res);
                        getData();
                    });
                if (deletedUrls.length > 0) {
                    deleteImages(deletedUrls)
                        .then((res) => {
                            setDeletedUrls([]);
                        });
                }
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
                    data.metaphysicalTags,
                    data.imageUrls,
                )
                    .then(res => {
                        receiveResponse(res);
                        getData();
                        
                        // Update dialog props in parent
                        const displayName = res.data.commonName || 'Wood';
                        setDialogProps(prev => ({
                            ...prev,
                            element: res.data,
                            title: `Edit Wood '${displayName}'`
                        }));
                        
                        // Update local title
                        setLocalTitle(`Edit Wood '${displayName}'`);
                        
                        // Update form with new data that includes ID
                        reset(res.data);
                        setSavedMaterial(true);
                    });
            }
        } else if (materialType === 'crystal') {
            if (existingMaterial) {
                editCrystal(
                    data._id,
                    data.crystalName,
                    data.status,
                    data.tier,
                    data.colors,
                    data.crystalCategory,
                    data.psychologicalCorrespondence,
                    data.imageUrls,
                )
                    .then(res => {
                        receiveResponse(res);
                        getData();
                    });
                if (deletedUrls.length > 0) {
                    deleteImages(deletedUrls)
                        .then((res) => {
                            setDeletedUrls([]);
                        });
                }
            } else {
                createCrystal(
                    data.crystalName,
                    data.status,
                    data.tier,
                    data.colors,
                    data.crystalCategory,
                    data.psychologicalCorrespondence,
                    data.imageUrls,
                )
                    .then(res => {
                        receiveResponse(res);
                        getData();
                        
                        // Update dialog props in parent
                        const displayName = res.data.crystalName || 'Crystal';
                        setDialogProps(prev => ({
                            ...prev,
                            element: res.data,
                            title: `Edit Stone/Crystal '${displayName}'`
                        }));
                        
                        // Update local title
                        setLocalTitle(`Edit Stone/Crystal '${displayName}'`);
                        
                        // Update form with new data that includes ID
                        reset(res.data);
                        setSavedMaterial(true);
                    });
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
                            valueKey="label"
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
                            valueKey="label"
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
        const crystalName = watch("crystalName");
        const crystalCategory = watch("crystalCategory");
        const colors = watch("colors");
        const psychologicalCorrespondence = watch("psychologicalCorrespondence");
        const status = watch("status");
        const tier = watch("tier");
        
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
                            valueKey="label"
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
                            valueKey="label"
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
                            valueKey="label"
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
            <DialogTitle style={dialogTitleStyle}>
                {localTitle}
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
            <DialogContent style={dialogContentStyle}>
                <form className="material-form" onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <div className="form-column">
                        <FormSelect
                            title="Material Type*"
                            disabled={!!existingMaterial}
                            value={materialType}
                            options={materialTypeOptions}
                            displayKey="label"
                            valueKey="value"
                            onChange={(e) => setMaterialType(e.target.value)}
                        />
                        {materialType === 'wood' && renderWoodAttributes()}
                        {materialType === 'crystal' && renderCrystalAttributes()}
                        <DialogImageSection
                            folder={'materials'}
                            existingItem={existingMaterial}
                            imageUrls={getValues('imageUrls') || []}
                            onImageDelete={(imageUrl) => {
                                setDeletedUrls(prev => [...prev, imageUrl]);
                                const newImageUrls = (getValues('imageUrls') || []).filter(url => url !== imageUrl);
                                setValue('imageUrls', newImageUrls);
                            }}
                            onImageUpload={(imageUrls, isReorder) => {
                                if (isReorder) {
                                    setValue('imageUrls', imageUrls);
                                } else {
                                    // Add new images to the existing array (for uploading new images)
                                    const currentImageUrls = getValues('imageUrls') || [];
                                    const updatedImageUrls = [...currentImageUrls, ...imageUrls];
                                    setValue('imageUrls', updatedImageUrls);
                                    handleSubmit(onSubmit)();
                                }
                            }}
                        />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function UserDialog({ open, onClose, title: initialTitle, getData, setDialogProps, element = { email: '', password: '', firstName: '', lastName: '' } }) {
    const [savedUser, setSavedUser] = useState(false);
    const [localTitle, setLocalTitle] = useState(initialTitle);
    
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
        defaultValues: element
    });

    // Update local title when prop changes
    useEffect(() => {
        setLocalTitle(initialTitle);
    }, [initialTitle]);

    const existingUser = savedUser || !!element._id;

    useEffect(() => {
        if (open) {
            reset(element);
            setSavedUser(!!element._id);
        }
    }, [open, reset]);

    const onSubmit = (data) => {
        const userData = {
            _id: data._id,
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
                    
                    // Update dialog props in parent
                    setDialogProps(prev => ({
                        ...prev,
                        element: res.data,
                        title: `Edit User '${res.data.firstName || res.data.email}'`
                    }));
                    
                    // Update local title
                    setLocalTitle(`Edit User '${res.data.firstName || res.data.email}'`);
                    
                    // Update form with new data that includes ID
                    reset(res.data);
                    setSavedUser(true);
                });
        } else {
            editUser(userData._id, userData.email, userData.firstName, userData.lastName)
                .then((res) => {
                    receiveResponse(res);
                    getData();
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
            <DialogTitle style={dialogTitleStyle}>
                {localTitle}
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
            <DialogContent style={dialogContentStyle}>
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
                                type="password"
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
    const handleDeleteImages = (imageUrls) => {
        if (imageUrls && imageUrls.length > 0) {
            deleteImages(imageUrls);
        }
    };

    const handleDelete = () => {
        switch (adminPage) {
            case 'Cues':
                deleteCue(element._id)
                    .then((res) => {
                        handleDeleteImages(element?.imageUrls);
                        receiveResponse(res);
                        getData();
                        onClose();
                    });
                break;
            case 'Accessories':
                deleteAccessory(element._id)
                    .then((res) => {
                        handleDeleteImages(element?.imageUrls);
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
                            handleDeleteImages(element?.imageUrls);
                            receiveResponse(res);
                            getData();
                            onClose();
                        })
                } else if (element.crystalName) {
                    // It's a crystal material
                    deleteCrystal(element._id)
                        .then((res) => {
                            handleDeleteImages(element?.imageUrls);
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
                deleteUser(element._id)
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
                    
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                        <span 
                            onClick={onClose} 
                            style={{ 
                                textDecoration: 'underline', 
                                cursor: 'pointer',
                                color: '#333',
                                fontSize: '1rem'
                            }}
                        >
                            Cancel
                        </span>
                        <DefaultButton
                            text="Delete"
                            onClick={handleDelete}
                        />
                    </div>
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
        changePassword(element._id, data.password)
            .then((res) => {
                receiveResponse(res);
                onClose();
            });
    };

    const formRef = useRef(null);
    const firstName = element.firstName;
    const password = watch("password");

    return (
        <Dialog open={open} onClose={onClose} >
            <DialogTitle>
                {title} {firstName && `'${firstName}'`}
                <button
                    type="button"
                    className='fa-solid fa-xmark admin-action-button'
                    style={{ display: 'inline-block', float: 'right', justifySelf: 'right', fontSize: '1.5rem', marginTop: '-0.05rem' }}
                    onClick={onClose}
                />
            </DialogTitle>
            <DialogContent>
                <form className="password-form" onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <div className="form-column">
                        <FormField
                            title="Password"
                            type="password"
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
                        
                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                            <span 
                                onClick={onClose} 
                                style={{ 
                                    textDecoration: 'underline', 
                                    cursor: 'pointer',
                                    color: '#333',
                                    fontSize: '1rem'
                                }}
                            >
                                Cancel
                            </span>
                            <DefaultButton
                                text="Save"
                                type="submit"
                            />
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DialogImageSection({ folder = 'general', existingItem, imageUrls = [], onImageDelete, onImageUpload }) {
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [localImageUrls, setLocalImageUrls] = useState(imageUrls);
    
    // Keep local state in sync with props when props change
    useEffect(() => {
        setLocalImageUrls(imageUrls);
    }, [imageUrls]);
    
    // Handle drag start
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.parentNode);
        
        setTimeout(() => {
            e.target.style.opacity = '0.4';
        }, 0);
    };
    
    // Handle drag end
    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        document.querySelectorAll('.image-over').forEach(item => {
            item.classList.remove('image-over');
        });
    };
    
    // Handle drag over another item
    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    };
    
    // Apply visual cue when dragging over a drop target
    const handleDragEnter = (e, index) => {
        const listItem = e.target.closest('.MuiImageListItem-root');
        if (listItem) {
            listItem.classList.add('image-over');
        }
    };
    
    // Remove visual cue when leaving a drop target
    const handleDragLeave = (e) => {
        const listItem = e.target.closest('.MuiImageListItem-root');
        if (listItem) {
            listItem.classList.remove('image-over');
        }
    };
    
    // Handle the actual drop - update local state immediately for visual feedback
    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (draggedIndex === null || draggedIndex === dropIndex) return;
        
        // Create a copy of the local image URLs array
        const newImageUrls = [...localImageUrls];
        
        // Remove the dragged item
        const draggedItem = newImageUrls[draggedIndex];
        newImageUrls.splice(draggedIndex, 1);
        
        // Insert at the new position
        newImageUrls.splice(dropIndex, 0, draggedItem);
        
        // Update local state immediately to show the change visually
        setLocalImageUrls(newImageUrls);
        
        // Notify parent component about the reordering
        onReorder(newImageUrls);
        
        // Reset
        setDraggedIndex(null);
        const listItem = e.target.closest('.MuiImageListItem-root');
        if (listItem) {
            listItem.classList.remove('image-over');
        }
        return false;
    };
    
    // Function to pass the reordered array to the parent component
    const onReorder = (newOrder) => {
        if (typeof onImageUpload === 'function') {
            onImageUpload(newOrder, true);
        }
    };

    return (
        <>
            {existingItem && localImageUrls && localImageUrls.length > 0 && (
                <div>
                    <h2 className="dialog-header2" style={{ marginTop: '20px' }}>Images</h2>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                        Drag and drop images to reorder them
                    </p>
                    <ImageList sx={{ 
                        width: '100%', 
                        height: 'auto', 
                        maxHeight: 400, 
                        margin: "0px 0px 0px 0px" 
                    }} cols={4} rowHeight={200} gap={8}>
                        {localImageUrls.map((imageUrl, index) => (
                            <ImageListItem 
                                key={`${imageUrl}-${index}`} 
                                sx={{
                                    overflow: 'hidden',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    cursor: 'grab',
                                    transition: 'all 0.2s ease',
                                    '&.image-over': {
                                        boxShadow: '0 0 0 2px #1976d2',
                                        transform: 'scale(1.02)'
                                    }
                                }}
                                draggable="true"
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                            >
                                <img
                                    src={imageUrl}
                                    alt={`Item ${index}`}
                                    loading="lazy"
                                    draggable="false"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        pointerEvents: 'none'
                                    }}
                                />
                                <ImageListItemBar
                                    title={imageUrl.substring(imageUrl.lastIndexOf('/') + 1, imageUrl.indexOf('?') !== -1 ? imageUrl.indexOf('?') : undefined).substring(0, 20)}
                                    position="bottom"
                                    actionIcon={
                                        <IconButton
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onImageDelete(imageUrl);
                                            }}
                                            sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
                                            aria-label={`delete image ${index}`}
                                        >
                                            <i className="fa-solid fa-times"></i>
                                        </IconButton>
                                    }
                                    sx={{
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '5px',
                                    left: '5px',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {index + 1}
                                </div>
                            </ImageListItem>
                        ))}
                    </ImageList>
                </div>
            )}
            {existingItem && (
                <ImageUploader
                    folder={folder}
                    onImageUploaded={onImageUpload}
                />
            )}

            <style jsx>{`
                .image-over {
                    box-shadow: 0 0 0 2px #1976d2 !important;
                    transform: scale(1.02);
                }
            `}</style>
        </>
    );
}

const tableProps = {
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

const dialogTitleStyle = {
    padding: '10px 24px',
    position: 'relative',
    zIndex: 1,
    backgroundColor: '#f5f5f5',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const dialogContentStyle = {
    marginTop: '24px'
};
