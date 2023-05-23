import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAppDispatch } from '../../hooks'
import { AttachmentType } from '../../globalTypes';
import {
  getAttachments,
  deleteAttachments,
  deleteAttachmentPreviews,
} from '../../slices/formSlice';

type AttachmentsPreviewProps = {
  attachmentsList: AttachmentType[],
  event_id: number | null,
  mode: string,
  editingEnabled: boolean,
}

export default function AttachmentsPreview(props: AttachmentsPreviewProps) {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down('sm'))
  const medium = useMediaQuery(theme.breakpoints.down('md'))
  const large = useMediaQuery(theme.breakpoints.down('lg'))

  const { attachmentsList, event_id, mode, editingEnabled } = props;
  const dispatch = useAppDispatch();

  const getAttachmentsData = async () => {
    await fetch(`/attachments/${event_id}`)
      .then(response => response.json())
      .then(response => dispatch(getAttachments(response)))
      .catch(error => console.log(error));
  };

  const deleteAttachmentsData = async (attachment_id: number, file_path: string | ArrayBuffer, event_id: number) => {
    await fetch(`/attachments/${attachment_id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({file_path, event_id})
    })
    .then(response => response.json())
    .then(response => dispatch(deleteAttachments(response.id)))
    .then(() => getAttachmentsData())
    .catch(error => console.log(error));
  };

  const handleDeletePreview = (file_name: string) => {
    dispatch(deleteAttachmentPreviews(file_name))
  };

  const imageListStyles = {
    width: '100%',
    height: 'auto',
    maxHeight: 300,
    maxWidth: mode === 'preview' ? 600 : 500
  }

  return (
    <ImageList sx={imageListStyles} data-testid="attachments_preview">
      {mode === 'preview' ? (
        <ImageListItem
          key="Subheader"
          cols={(small && 1) || (medium && 2) || (large && 2) || 3}
        >
        <ListSubheader component="div">
          <Typography>
            Selected Files
          </Typography>
        </ListSubheader>
        </ImageListItem>
      ) : null}
      {attachmentsList.map((attachment: AttachmentType, index) => (
        <ImageListItem
          key={mode === 'preview' ? attachment.file_name + index : attachment.attachment_id}
          sx={{maxHeight: 200, maxWidth: mode === 'preview' ? 180 : 200, }}
        >
          {mode === 'preview' ? (
            <img 
              src={`${attachment.file_path}`}
              srcSet={`${attachment.file_path}`}
              alt={`${attachment.file_type} attachment`}
              loading="lazy"
              style={{maxHeight: '200px'}}
            />
          ) : (
            <img
              src={`${attachment.file_path?.slice(8)}?w=248&fit=crop&auto=format`}
              srcSet={`${attachment.file_path?.slice(8)}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={`${attachment.file_type} attachment`}
              loading="lazy"
            />
          )}
          <ImageListItemBar
            title={attachment.file_name}
            subtitle={attachment.file_type}
            actionIcon={
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)', visibility: editingEnabled ? 'unset' : 'hidden' }}
                aria-label={`delete attachment ${attachment.file_name}`}
                onClick={() => mode === 'preview' ? 
                handleDeletePreview(attachment.file_name) 
                : deleteAttachmentsData(attachment.attachment_id!, attachment.file_path!, event_id!)}
              >
                <DeleteIcon />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};
