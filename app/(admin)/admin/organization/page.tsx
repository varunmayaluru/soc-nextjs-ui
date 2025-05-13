'use client';


import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api-client';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { se } from 'date-fns/locale';
import { Pencil, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import { Organization } from "../../../types/types"


export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [nameError, setnameError] = useState({show:false, message:''});
  const [slugError, setSlugError] = useState({show:false, message:''});
  const [timezoneError, setTimezoneError] = useState({show:false, message:''});
  const [form, setForm] = useState<Omit<Organization, 'organization_id' | 'create_date_time' | 'update_date_time'>>({
    organization_name: '',
    slug: '',
    description: '',
    timezone: '',
    is_active: true,
    created_by: '101',
  });
  
  const timezones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Kolkata',
  'Asia/Tokyo',
  'Australia/Sydney',
];

useEffect(() => {
  fetchOrganizations();
}, []);
const fetchOrganizations = async () => {
    try {
          const response = await api.get<Organization[]>(`/organizations/organizations/organizations`)
    
          if (response.ok) {
            setOrgs(response.data)
          } else {
            throw new Error("Failed to fetch topics")
          }
        } catch (error) {
          console.error("Error fetching topics:", error)
          toast({
            title: "Error",
            description: "Failed to load topics. Please try again.",
            variant: "destructive",
          })
         
         
        } finally {
          setLoading(false)
        }
  };
const createOrganization = async (newOrg: Omit<Organization, 'organization_id' | 'create_date_time' | 'update_date_time'>) => {
  try {
    const response = await api.post<Organization>("/organizations/organizations/organizations", newOrg);

    if (response.ok) {
      toast({
        title: "Success",
        description: "Organization created successfully.",
      });
      fetchOrganizations(); // Refresh the list
    } else {
      throw new Error("Failed to create organization");
    }
  } catch (error) {
    console.error("Error creating organization:", error);
    toast({
      title: "Error",
      description: "Failed to create organization. Please try again.",
      variant: "destructive",
    });
  }
};
const updateOrganization = async (updatedOrg: Organization) => {
  try {
    const response = await api.put<Organization>(
      `/organizations/organizations/organizations/${updatedOrg.organization_id}`,
      updatedOrg
    );

    if (response.ok) {
      toast({
        title: "Success",
        description: "Organization updated successfully.",
      });
      fetchOrganizations(); // Refresh the list
    } else {
      throw new Error("Failed to update organization");
    }
  } catch (error) {
    console.error("Error updating organization:", error);
    toast({
      title: "Error",
      description: "Failed to update organization. Please try again.",
      variant: "destructive",
    });
  }
};

  const openModal = (org?: Organization) => {
    if (org) {
      setEditingOrg(org);
      setForm({
        organization_name: org.organization_name,
        slug: org.slug,
        description: org.description,
        timezone: org.timezone,
        is_active: org.is_active,
        created_by: org.created_by,
      });
    } else {
      setEditingOrg(null);
      setForm({
        organization_name: '',
        slug: '',
        description: '',
        timezone: '',
        is_active: true,
        created_by: '101',	
      });
    }
    setShowModal(true);
  };
  const clearErrors = () => {
      setnameError({ show: false, message: '' });
      setSlugError({ show: false, message: '' }); 
      setTimezoneError({ show: false, message: '' });
  };
const validateForm = () => 
  {

       clearErrors();
      if (!form.organization_name) {
        setnameError({ show: true, message: 'Organization Name is Required' });
        return false;
      }
      if (form.organization_name.length < 3) {
        setnameError({ show: true, message: 'Organization Name should be at least 3 characters' });
        return false;
      }
      if (form.organization_name.length > 50) {
        setnameError({ show: true, message: 'Organization Name should be at most 50 characters' });
        return false;
      }
      if (form.organization_name.match(/[^a-zA-Z0-9 ]/)) {
        setnameError({ show: true, message: 'Organization Name should only contain alphanumeric characters and spaces' });
        return false;
      }

      if (!form.slug) {
        setSlugError({ show: true, message: 'Slug is Required' });
        return false;
      }
      if (form.slug.length < 3) {
        setSlugError({ show: true, message: 'Slug should be at least 3 characters' });
        return false;
      }
      if (form.slug.length > 50) {
        setSlugError({ show: true, message: 'Slug should be at most 50 characters' });
        return false;
      }
      if(form.timezone === '') {
        setTimezoneError({ show: true, message: 'Timezone is Required' });
        return false;

      }
      clearErrors();
      return true;
      };
   const handleSubmit = () => {
    

      if (!validateForm()) {
        return;
      }
  
    if (editingOrg) {
      // Update
      const updated = orgs.map((org) =>
        org.organization_id === editingOrg.organization_id
          ? {
              ...editingOrg,
              ...form,
              update_date_time: new Date().toISOString(),
            }
          : org
      );
      updateOrganization({
        ...editingOrg, ...form, update_date_time: new Date().toISOString() });
      setOrgs(updated);
    } else {
      // Create
      const newOrg: Organization = {
        ...form,
        organization_id: Math.max(...orgs.map((o) => o.organization_id)) + 1,
        create_date_time: new Date().toISOString(),
        update_date_time: new Date().toISOString(),
      };
      createOrganization(newOrg);

      setOrgs([...orgs, newOrg]);
    }

    setShowModal(false);
  };

  return (
    
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Organizations</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => openModal()} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Organization
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
      <div className="overflow-auto">
        <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Timezone</TableHead>
          <TableHead>Active</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orgs.map((org) => (
          <TableRow key={org.organization_id}>
            <TableCell>{org.organization_id}</TableCell>
            <TableCell className="font-medium">{org.organization_name}</TableCell>
            <TableCell>{org.slug}</TableCell>
            <TableCell className="max-w-xs truncate">{org.description}</TableCell>
            <TableCell>{org.timezone}</TableCell>
            <TableCell>{org.is_active ? "Yes" : "No"}</TableCell>
            <TableCell>{new Date(org.create_date_time).toLocaleString()}</TableCell>
            <TableCell>{org.created_by}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => openModal(org)}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editingOrg ? 'Edit Organization' : 'Add Organization'}
            </h2>

            <div className="flex flex-col space-y-4">
              <input
                className="border p-2"
                placeholder="Organization Name"
                value={form.organization_name}
                onChange={(e) => setForm({ ...form, organization_name: e.target.value })}
              />
              { nameError.show && (
                <p className="text-red-500 text-sm">{nameError.message}</p>
              )}
              <input
                className="border p-2"
                placeholder="Slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
              { slugError.show && (
                <p className="text-red-500 text-sm">{slugError.message}</p>
              )}
              <textarea
                rows={2}
                className="border p-2"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

            <select
                className="border p-2"
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              >
                <option value="">Select Timezone</option>
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
          </select>
              { timezoneError.show && (
                <p className="text-red-500 text-sm">{timezoneError.message}</p>
              )}
              <input
                className="border p-2"
                placeholder="Created By"
                value={form.created_by}
                onChange={(e) => setForm({ ...form, created_by: e.target.value })}
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                />
                <span>Is Active</span>
              </label>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {editingOrg ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
