import { useState } from "react"
import { PlusIcon, Trash2Icon, PencilIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define the URL item type
type UrlItem = {
  id: string
  url: string
  name: string
  status: "active" | "inactive" | "pending"
}

export function UrlManager() {
  // Sample initial data
  const [urls, setUrls] = useState<UrlItem[]>([
    { id: "1", url: "https://example.com", name: "Example Site", status: "active" },
    { id: "2", url: "https://test.com", name: "Test Site", status: "inactive" },
    { id: "3", url: "https://demo.com", name: "Demo Site", status: "pending" },
  ])

  // State for the edit/add panel
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentItem, setCurrentItem] = useState<UrlItem>({
    id: "",
    url: "",
    name: "",
    status: "active",
  })

  // Open the panel for adding a new item
  const handleAdd = () => {
    setCurrentItem({
      id: Date.now().toString(),
      url: "",
      name: "",
      status: "active",
    })
    setIsEditing(false)
    setIsOpen(true)
  }

  // Open the panel for editing an existing item
  const handleEdit = (item: UrlItem) => {
    setCurrentItem({ ...item })
    setIsEditing(true)
    setIsOpen(true)
  }

  // Handle deleting an item
  const handleDelete = (id: string) => {
    setUrls(urls.filter((item) => item.id !== id))
    toast.success("Item deleted successfully")
  }

  // Handle saving an item (new or edited)
  const handleSave = () => {
    if (!currentItem.url || !currentItem.name) {
      toast.error("URL and Name are required")
      return
    }

    if (isEditing) {
      // Update existing item
      setUrls(urls.map((item) => (item.id === currentItem.id ? currentItem : item)))
      toast.success("Item updated successfully")
    } else {
      // Add new item
      setUrls([...urls, currentItem])
      toast.success("Item added successfully")
    }

    setIsOpen(false)
  }

  return (
    <div className="px-4 lg:px-6 relative">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>URL Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urls.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.url}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          item.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : item.status === "inactive"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                          <PencilIcon className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                          <Trash2Icon className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {urls.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No URLs found. Add one to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Floating Add Button */}
      <Button className="fixed bottom-6 right-6 rounded-full w-12 h-12 shadow-lg" onClick={handleAdd}>
        <PlusIcon className="h-6 w-6" />
        <span className="sr-only">Add URL</span>
      </Button>

      {/* Edit/Add Panel */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md" style={
                    {
                      background: 'white',
                      padding:24,
                    } as React.CSSProperties
                  }>
          <SheetHeader>
            <SheetTitle>{isEditing ? "Edit URL" : "Add URL"}</SheetTitle>
            <SheetDescription>
              {isEditing ? "Make changes to the URL details here." : "Add a new URL to your collection."}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={currentItem.url}
                onChange={(e) => setCurrentItem({ ...currentItem, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={currentItem.name}
                onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                placeholder="My Website"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={currentItem.status}
                onValueChange={(value: "active" | "inactive" | "pending") =>
                  setCurrentItem({ ...currentItem, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleSave}>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

