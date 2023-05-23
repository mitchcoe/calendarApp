import { useEffect, useCallback } from 'react';
import { Box, Button, Modal, Stack } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../hooks'
import {
  getAttachments,
  addAttachments,
  setAttachmentPreviews,
} from '../../slices/formSlice';
import AttachmentsPreview from '../AttachmentsPreview/AttachmentsPreview'

type AttachmentsModalProps = {
  attachmentsModalOpen: boolean,
  handleAttachmentsModalClose: () => void,
  modalStyles: object, 
  hasAttachments: boolean, 
  event_id: number,
}
export default function AttachmentsModal(props: AttachmentsModalProps) {
  const { attachmentsModalOpen, handleAttachmentsModalClose, modalStyles, hasAttachments, event_id } = props;
  const attachmentPreviews = useAppSelector((state) => state.form.attachmentPreviews);
  const dispatch = useAppDispatch();

  const getAttachmentsData = useCallback( async () => {
    await fetch(`/attachments/${event_id}`)
      .then(response => response.json())
      .then(response => dispatch(getAttachments(response)))
      .catch(error => console.log(error));
  },[dispatch, event_id]);

  useEffect(() => {
    if(hasAttachments && attachmentsModalOpen) getAttachmentsData()
  }, [getAttachmentsData, hasAttachments, attachmentsModalOpen]);

  const fileUpload = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    let form = document.getElementById('fileUploadForm') as HTMLFormElement
    let formData = new FormData(form)

    await fetch(`/attachments/${event_id}`, {
      method:'POST',
      body: formData
    })
    .then(response => response.json())
    .then(response => dispatch(addAttachments(response.data)))
    .then(() => handleAttachmentsModalClose())
    .catch(error => console.log(error));
  };

  const handleAddPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files as ArrayLike<File>);

    files.forEach(async (file) => {
      let filereader = new FileReader();
      filereader.onload = async (val) => {
        let attachment = {
          file_type: file.type,
          file_path: filereader.result,
          file_name: file.name,
          event_id: event_id,
        }
        dispatch(setAttachmentPreviews(attachment))
      };
      filereader.readAsDataURL(file)
    });
  };

  return (
    <Modal
      open={attachmentsModalOpen}
      onClose={handleAttachmentsModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      data-testid="attachments_modal"
    >
      <Box sx={[modalStyles, {width: 700, maxHeight: 700}]}>
        <form
          action="/attachments"
          encType="multipart/form-data"
          method="post"
          id="fileUploadForm"
        >
          <Stack direction="row" alignItems="center" spacing={8}>
            <Button variant="contained" component="label">
              Choose file:
              <input
                type="file"
                accept="image/*"
                name="file"
                id="fileUploadInput"
                multiple
                hidden
                onChange={handleAddPreview}
              />
            </Button>
            <Button
              type="submit"
              id="fileUploadSubmit"
              className="btn btn-default"
              onClick={fileUpload}
              variant="contained"
            >
              Add Attachments
            </Button>
          </Stack>
        </form>
        {attachmentPreviews?.length ? (
          <AttachmentsPreview
            attachmentsList={attachmentPreviews}
            event_id={event_id}
            mode="preview"
            editingEnabled
          />
        ) : null}
      </Box>
    </Modal>
  )
};
